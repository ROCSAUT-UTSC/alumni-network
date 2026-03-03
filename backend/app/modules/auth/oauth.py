import httpx
import urllib.parse

from jose import jwt, JWTError
from typing import Any, Dict, Optional
from datetime import timedelta
from typing_extensions import Protocol

from app.modules.systems.utils import utcnow
from app.modules.systems.config import get_settings
from app.modules.auth.schemas import OAuthProvider

settings = get_settings()

class OAuthProviderClient(Protocol):
    name: OAuthProvider

    def build_authorization_url(self, *, redirect_uri: str, state: str) -> str: ...
    def exchange_code(
        self, *, code: str, redirect_uri: str, code_verifier: str | None = None
    ) -> Dict[str, Any]: ...
    def fetch_profile(self, *, tokens: Dict[str, Any]) -> Dict[str, Any]: ...


### Google OAuth Provider ###
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
    
### OAuth State Token Management ###
def create_oauth_state(
    *,
    provider: OAuthProvider,
    redirect_uri: str,
    role: Optional[str] = None,
) -> str:
    """
    Create a signed, short-lived state token for OAuth.
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


def verify_oauth_state(
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