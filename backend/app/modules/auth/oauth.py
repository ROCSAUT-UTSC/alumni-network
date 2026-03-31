from __future__ import annotations

import httpx
import urllib.parse
from datetime import timedelta
from typing import Any, Dict, Optional

from jose import jwt, JWTError
from typing_extensions import Protocol
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import AccountUser, AccountIdentity
from app.modules.systems.utils import utcnow
from app.modules.systems.config import get_settings
from app.modules.auth.schemas import OAuthProvider
from app.modules.accounts.constants import UserRole


settings = get_settings()

class OAuthProviderClient(Protocol):
    """Common interface for OAuth providers."""

    name: OAuthProvider

    def build_authorization_url(self, *, redirect_uri: str, state: str) -> str: ...
    def exchange_code(
        self, *, code: str, redirect_uri: str, code_verifier: str | None = None
    ) -> Dict[str, Any]: ...
    def fetch_profile(self, *, tokens: Dict[str, Any]) -> Dict[str, Any]: ...

class GoogleOAuthClient:
    name: OAuthProvider = "google"

    def __init__(self) -> None:
        self.settings = get_settings()

    def build_authorization_url(self, *, redirect_uri: str, state: str) -> str:
        params = {
            "client_id": self.settings.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "include_granted_scopes": "true",
        }
        return f"{self.settings.GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"

    def exchange_code(
        self, *, code: str, redirect_uri: str, code_verifier: str | None = None
    ) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "code": code,
            "client_id": self.settings.GOOGLE_CLIENT_ID,
            "client_secret": self.settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        if code_verifier:
            data["code_verifier"] = code_verifier

        with httpx.Client(timeout=10.0) as client:
            resp = client.post(self.settings.GOOGLE_TOKEN_URL, data=data)
            resp.raise_for_status()
            return resp.json()

    def fetch_profile(self, *, tokens: Dict[str, Any]) -> Dict[str, Any]:
        access_token = tokens.get("access_token")
        if not access_token:
            raise ValueError("Missing access_token in tokens")

        with httpx.Client(timeout=10.0) as client:
            resp = client.get(
                self.settings.GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            resp.raise_for_status()
            return resp.json()


_google_client = GoogleOAuthClient()

PROVIDERS: dict[OAuthProvider, OAuthProviderClient] = {
    "google": _google_client,
}


def get_provider_client(provider: OAuthProvider) -> OAuthProviderClient:
    try:
        return PROVIDERS[provider]
    except KeyError:
        raise ValueError(f"Unsupported provider: {provider}")

def create_oauth_state(
    *,
    provider: OAuthProvider,
    redirect_uri: str,
    role: Optional[str] = None,
) -> str:
    """
    Create a signed, short-lived state token for OAuth.

    Encodes:
      - typ: "oauth_state"
      - prv: provider ("google" / "linkedin" / "apple")
      - ru: redirect uri
      - exp: expiry (seconds from now)
      - role: optional role hint ("student" / "alumni")
    """
    now = utcnow()
    exp = now + timedelta(seconds=settings.OAUTH_STATE_TTL_SECONDS)

    payload: Dict[str, Any] = {
        "typ": "oauth_state",
        "prv": provider,
        "ru": redirect_uri,
        "exp": exp,
    }
    if role is not None:
        payload["role"] = role

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_oauth_state(
    *,
    state: str,
    expected_provider: OAuthProvider,
    redirect_uri: str,
) -> Dict[str, Any]:
    """
    Verify and decode the OAuth state token.
    Raises JWTError if invalid/expired.
    """
    try:
        payload = jwt.decode(
            state,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise JWTError(f"Invalid state: {exc}") from exc

    if payload.get("typ") != "oauth_state":
        raise JWTError("Invalid state type")

    if payload.get("prv") != expected_provider:
        raise JWTError("State provider mismatch")

    if payload.get("ru") != redirect_uri:
        raise JWTError("State redirect_uri mismatch")

    return payload

verify_oauth_state = decode_oauth_state

def resolve_oauth_user(
    db: Session,
    *,
    provider: OAuthProvider,
    provider_sub: str,
    email: str,
    email_verified: bool,
    role: Optional[UserRole] = None,
) -> AccountUser:
    """
    Find or create an AccountUser for this OAuth identity.

    Rules:
      1. If an AccountIdentity exists for (provider, provider_sub) -> return that account.
      2. Else if an AccountUser exists for this email -> attach identity (if missing) and return it.
      3. Else create a new AccountUser:
           - role: from `role` if allowed, otherwise default to STUDENT
           - is_verified: email_verified from provider
           - is_active: True
    """
    identity_stmt = select(AccountIdentity).where(
        AccountIdentity.provider == provider,
        AccountIdentity.provider_sub == provider_sub,
    )
    identity = db.execute(identity_stmt).scalar_one_or_none()

    if identity and identity.user:
        return identity.user


    user_stmt = select(AccountUser).where(AccountUser.email == email)
    existing_user = db.execute(user_stmt).scalar_one_or_none()

    if existing_user:
        # Attach identity if not already present for this provider
        existing_identity_stmt = select(AccountIdentity).where(
            AccountIdentity.user_uid == existing_user.uid,
            AccountIdentity.provider == provider,
        )
        existing_identity = db.execute(existing_identity_stmt).scalar_one_or_none()

        if not existing_identity:
            db.add(
                AccountIdentity(
                    user_uid=existing_user.uid,
                    provider=provider,
                    provider_sub=provider_sub,
                    email_at_time=email,
                )
            )
            db.flush()

        return existing_user

    # No user -> create new one

    allowed_roles = {UserRole.STUDENT, UserRole.ALUMNI}
    if role not in allowed_roles:
        final_role = UserRole.STUDENT
    else:
        final_role = role

    timezone = getattr(settings, "DEFAULT_TIMEZONE", "America/Toronto")

    user = AccountUser(
        email=email,
        password_hash=None,
        timezone=timezone,
        role=final_role,
        is_active=True,
        is_verified=email_verified,
        token_version=0,
    )
    db.add(user)
    db.flush()

    identity = AccountIdentity(
        user_uid=user.uid,
        provider=provider,
        provider_sub=provider_sub,
        email_at_time=email,
    )
    db.add(identity)
    db.commit()
    db.flush(user)

    return user