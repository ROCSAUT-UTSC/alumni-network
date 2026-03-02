from __future__ import annotations

import uuid

from datetime import timezone
from jose import JWTError
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request, Query
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select
from urllib.parse import urlencode


from app.models.user import AccountUser

from app.modules.systems.utils import utcnow
from app.modules.systems.email_service import send_verification_email
from app.modules.auth.deps import *
from app.modules.auth.schemas import *
from app.modules.auth.security import *
from app.modules.auth.oauth import create_oauth_state, get_provider_client, resolve_oauth_user, verify_oauth_state
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
def login( form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login with **email and password**.

    Swagger / OAuth2 will send:
        username = email
        password = password
    """
    email = form_data.username
    password = form_data.password

    user = db.execute(select(AccountUser).where(AccountUser.email == email)).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses OAuth. Please sign in with Google/LinkedIn.",
        )

    if not verify_password(password, user.password_hash):
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
@router.get("/oauth/google/start")
def google_oauth_start(
    role: UserRole = Query(UserRole.STUDENT),
):
    """
    Start Google OAuth flow.

    - Frontend hits this with a simple link: /api/auth/oauth/google/start?role=student|alumni
    - We create a signed state token (with provider + redirect_uri + role)
    - We build Google authorization URL and redirect the browser there.
    """
    allowed_roles = {UserRole.STUDENT, UserRole.ALUMNI}
    if role not in allowed_roles:
        role = UserRole.STUDENT

    state = create_oauth_state(
        provider="google",               
        redirect_uri= settings.OAUTH_REDIRECT_URI,
        role=str(role),                  
    )

    client = get_provider_client("google")
    authorization_url = client.build_authorization_url(
        redirect_uri=settings.OAUTH_REDIRECT_URI,
        state=state,
    )

    return RedirectResponse(
        url=authorization_url,
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )

@router.get("/oauth/google/callback")
async def google_oauth_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Google OAuth callback.

    - Google redirects here with `code` and `state`.
    - We validate `state`, exchange code for tokens, fetch profile.
    - We resolve/create AccountUser via `resolve_oauth_user`.
    - We issue our own JWTs and redirect to frontend with a `needs_profile` hint.
    """

    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code or state")

    try:
        state_payload = verify_oauth_state(
            state=state,
            expected_provider="google",                # <- same literal
            redirect_uri=settings.OAUTH_REDIRECT_URI,  # MUST match create_oauth_state + Google console
        )
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    
    role_str = state_payload.get("role")
    if role_str == str(UserRole.ALUMNI):
        desired_role = UserRole.ALUMNI
    else:
        desired_role = UserRole.STUDENT

    # Exchange code for Google tokens + fetch profile
    client = get_provider_client("google")
    tokens = client.exchange_code(
        code=code,
        redirect_uri=settings.OAUTH_REDIRECT_URI,
        code_verifier=None,  # if you add PKCE later, you’ll pass it here
    )
    profile = client.fetch_profile(tokens=tokens)

    email = profile.get("email")
    email_verified = profile.get("email_verified", False)
    sub = profile.get("sub")  # Google's user id

    if not email or not sub:
        raise HTTPException(
            status_code=400,
            detail="Google userinfo missing email or sub",
        )

    # Resolve or create AccountUser
    user = resolve_oauth_user(
        db=db,
        provider="google",      
        provider_sub=sub,
        email=email,
        email_verified=email_verified,
        role=desired_role,
    )

    # Issue tokens
    access = create_access_token(subject=str(user.uid), role=str(user.role))
    refresh = create_refresh_token(
        subject=str(user.uid),
        token_version=user.token_version,
    )

    # Decide if they need to create a profile
    user_me = build_user_me(db, user)
    needs_profile = not getattr(user_me, "has_profile", False)

    params = {"needs_profile": "1" if needs_profile else "0"}
    redirect_target = f"{settings.FRONTEND_URL}/oauth/done?{urlencode(params)}"

    resp = RedirectResponse(
        redirect_target,
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )
    resp.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
        max_age=3600,
    )
    resp.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
        max_age=30 * 24 * 3600,
    )

    return resp