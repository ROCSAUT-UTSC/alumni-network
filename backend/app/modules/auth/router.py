import uuid
from datetime import timezone
from jose import JWTError
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import select


from app.models.user import AccountUser
from app.models.account_identity import AccountIdentity

from app.modules.systems.utils import utcnow
from app.modules.systems.email_service import send_verification_email
from app.modules.auth.deps import *
from app.modules.auth.schemas import *
from app.modules.auth.security import *
from app.modules.auth.oauth import create_oauth_state, get_provider_client, verify_oauth_state
from app.modules.accounts.serivce import build_user_me
from app.modules.accounts.constants import UserRole


settings = get_settings()
router = APIRouter(prefix="/auth", tags=["auth"])

### GET CURRENT USER ROUTE ###
@router.get("/me", response_model=UserMe)
def get_me(
    db: Session = Depends(get_db),
    current_user: AccountUser = Depends(get_current_user),
):
    """
    Get current logged-in user info.
    """
    return build_user_me(db, current_user)

### REGISTRATION, LOGIN, REFRESH, LOGOUT ROUTES ###
@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    bg: BackgroundTasks,       
    db: Session = Depends(get_db),
):
    """
    Register a new user.
    """
    profile_role = settings.PROFILE_MODEL.get(payload.role)
    if not profile_role:
        raise HTTPException(status_code=400, detail="Unsupported role for register")

    token = None
    to_email = None

    try:
        with db.begin():
            account = AccountUser(
                email=payload.email,
                password_hash=hash_password(payload.password),
                timezone=payload.timezone,
                role=payload.role,
                is_active=True,
                is_verified=(not settings.REQUIRE_VERIFY),
                token_version=0,
            )
            db.add(account)
            db.flush()

            # If verification is required
            if settings.REQUIRE_VERIFY:
                token, jti_hash, exp = create_email_verify_token(subject=str(account.uid))
                account.verify_jti_hash = jti_hash
                account.verify_expires_at = exp
                account.last_activation_email_sent = utcnow()
                to_email = account.email

    except IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Send email after successful commit
    if settings.REQUIRE_VERIFY:
        bg.add_task(send_verification_email, to_email=to_email, token=token)
        return VerificationRequired()

    db.refresh(account)
    access = create_access_token(subject=str(account.uid), role=str(account.role))
    refresh = create_refresh_token(subject=str(account.uid), token_version=account.token_version)

    return RegisterSuccess(
        user=build_user_me(db, account),
        tokens={"access_token": access, "refresh_token": refresh},
    )

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    """
    user = db.execute(select(AccountUser).where(AccountUser.email == payload.email)).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses OAuth. Please sign in with Google/LinkedIn.",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if settings.REQUIRE_VERIFY and not user.is_verified:
        return VerificationRequired()

    user.last_login_at = utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)

    access = create_access_token(subject=str(user.uid), role=str(user.role))
    refresh = create_refresh_token(subject=str(user.uid), token_version=user.token_version)

    user_me = build_user_me(db, user)
    needs_profile = user_me.profile is None
    return LoginSuccess(needs_profile=needs_profile, tokens={"access_token": access, "refresh_token": refresh})

@router.post("/refresh", response_model=RefreshSuccess)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    """
    Refresh access and refresh tokens.
    """
    try:
        data = decode_token(payload.refresh_token, expected_type="refresh")
        user_uid = uuid.UUID(data["sub"])
        tv = int(data.get("tv", -1))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.execute(select(AccountUser).where(AccountUser.uid == user_uid)).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if tv != user.token_version:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access = create_access_token(subject=str(user.uid), role=str(user.role))
    refresh = create_refresh_token(subject=str(user.uid), token_version=user.token_version)

    return RefreshSuccess(tokens={"access_token": access, "refresh_token": refresh})


@router.post("/logout")
def logout(current_user: AccountUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Logout by invalidating existing refresh tokens.
    """
    current_user.token_version += 1
    db.add(current_user)
    db.commit()
    return {"status": "ok"}

### EMAIL VERIFICATION ROUTES ###
@router.post("/verify/resend")
def resend_verification(email: str, bg: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Resend verification email if needed.
    Cooldown applies to prevent spamming.
    """
    user = db.execute(select(AccountUser).where(AccountUser.email == email)).scalar_one_or_none()
    if not user or user.is_verified:
        return {"status": "ok"}

    if user.last_activation_email_sent:
        seconds = (utcnow() - user.last_activation_email_sent).total_seconds()
        if seconds < settings.VERIFY_RESEND_COOLDOWN_SECONDS:
            return {"status": "ok"}
    
    token, jti_hash, exp = create_email_verify_token(subject=str(user.uid))
    user.verify_jti_hash = jti_hash
    user.verify_expires_at = exp
    user.last_activation_email_sent = utcnow()

    db.add(user)
    db.commit()

    bg.add_task(send_verification_email, to_email=user.email, token=token)
    return {"status": "ok"}

@router.get("/verify/confirm")
def confirm_verification(token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_token(token, expected_type="verify")
        sub = payload["sub"]
        jti = payload.get("jti")
        if not jti:
            return {"status": "invalid_or_expired"}
        user_uid = uuid.UUID(sub)
    except (JWTError, ValueError):
        return {"status": "invalid_or_expired"}

    user = db.execute(select(AccountUser).where(AccountUser.uid == user_uid)).scalar_one_or_none()
    if not user or user.is_verified:
        return {"status": "invalid_or_expired"}

    expires = user.verify_expires_at
    if expires is not None and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)

    if not expires or expires < utcnow():
        return {"status": "invalid_or_expired"}

    if not user.verify_jti_hash or user.verify_jti_hash != hash_verify_jti(jti):
        return {"status": "invalid_or_expired"}

    user.is_verified = True
    user.verified_at = utcnow()
    user.verify_jti_hash = None
    user.verify_expires_at = None

    db.add(user)
    db.commit()

    return {"status": "verified"}

### OAUTH ROUTES ###
def _resolve_oauth_user(
    *,
    db: Session = Depends(get_db),
    provider: str,
    provider_sub: str,
    email: str,
    email_verified: bool,
    role: Optional[UserRole] = None,
) -> AccountUser:
    """
    Shared logic: link AccountIdentity -> AccountUser or create new user + profile.
    """
   # If identity already exist
    identity = db.execute(
        select(AccountIdentity).where(
            AccountIdentity.provider == provider,
            AccountIdentity.provider_sub == provider_sub,
        )
    ).scalar_one_or_none()

    if identity:
        user = db.execute(
            select(AccountUser).where(AccountUser.uid == identity.user_uid)
        ).scalar_one_or_none()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="Account is inactive")
        return user

    # If there is an existing user with this email
    user = db.execute(
        select(AccountUser).where(AccountUser.email == email)
    ).scalar_one_or_none()

    if user:
        identity = AccountIdentity(
            user_uid=user.uid,
            provider=provider,
            provider_sub=provider_sub,
            provider_email=email,
        )
        db.add(identity)
        db.commit()
        db.refresh(user)
        return user

    print("Creating new OAuth user:", email)
    # new user -> create AccountUser + profile
    default_role = UserRole.STUDENT

    user = AccountUser(
        email=email,
        password_hash=None,         
        timezone="America/Toronto",   
        role=role or default_role,
        is_active=True,
        is_verified=email_verified,  
        token_version=0,
    )
    db.add(user)
    db.commit()
    db.flush()

    return user

@router.post("/oauth/authorize", response_model=OAuthAuthorizeResponse)
def oauth_authorize(payload: OAuthAuthorizeRequest) -> OAuthAuthorizeResponse:
    """
    Start OAuth flow for a provider .
    Backend:
      - chooses redirect_uri based on FRONTEND_BASE_URL
      - creates a signed, short-lived state token
      - builds provider authorization URL
    """
    if payload.provider not in OAuthProvider.__args__:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported provider",
        )

    client = get_provider_client(payload.provider)
    settings = get_settings()
    redirect_uri = settings.OAUTH_REDIRECT_URI

    state = create_oauth_state(
        provider=payload.provider,
        redirect_uri=redirect_uri,
    )

    authorization_url = client.build_authorization_url(
        redirect_uri=redirect_uri,
        state=state,
    )

    return OAuthAuthorizeResponse(
        authorization_url=authorization_url,
        provider=payload.provider,
        state=state,
    )


@router.post("/oauth/exchange", response_model=OAuthLoginSuccess)
def oauth_exchange(
    payload: OAuthExchangeRequest,
    db: Session = Depends(get_db),
) -> OAuthLoginSuccess:
    """
    Exchange the authorization code for provider tokens + profile, then:
      - resolve/link/create AccountUser & profile
      - issue your normal JWT access/refresh tokens.
    """
    if payload.provider not in OAuthProvider.__args__:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported provider",
        )

    client = get_provider_client(payload.provider)
    settings = get_settings()
    redirect_uri = settings.OAUTH_REDIRECT_URI

    if not payload.code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing code")

    if not payload.state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing state")

    try:
        state_payload = verify_oauth_state(
            state=payload.state,
            expected_provider=payload.provider,
            redirect_uri=redirect_uri,
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state")

    try:
        tokens = client.exchange_code(
            code=payload.code,
            redirect_uri=redirect_uri,
            code_verifier=payload.code_verifier,
        )
    except Exception as e:
        print("Non-HTTP OAuth exchange error:", repr(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code with provider",
        )
    try:
        profile = client.fetch_profile(tokens=tokens)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch user info from provider",
        )
    
    # Resolve/link/create AccountUser & profile
    if payload.provider == "google":
        provider_sub = profile.get("sub")
        email = profile.get("email")
        email_verified = profile.get("email_verified", False)
    else:
        provider_sub = profile.get("id") or profile.get("sub")
        email = profile.get("email")
        email_verified = True

    if not provider_sub or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider did not return id or email",
        )

    user = _resolve_oauth_user(
        db=db,
        provider=payload.provider,
        provider_sub=provider_sub,
        email=email,
        email_verified=email_verified,
        role=payload.role,
    )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive")

    access = create_access_token(subject=str(user.uid), role=str(user.role))
    refresh = create_refresh_token(subject=str(user.uid), token_version=user.token_version)

    user_me = build_user_me(db, user)
    needs_profile = user_me.profile is None

    return OAuthLoginSuccess(
        tokens={"access_token": access, "refresh_token": refresh},
        needs_profile=needs_profile,
    )