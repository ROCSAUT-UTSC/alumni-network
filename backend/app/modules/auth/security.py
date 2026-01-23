import secrets
from jose import jwt, JWTError
from typing import Any, Dict, Literal, Optional
from datetime import timedelta
from passlib.context import CryptContext

from app.models.utils import utcnow
from app.modules.systems.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh"]

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(*, subject: str, role: str) -> str:
    now = utcnow()
    exp = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    claims: Dict[str, Any] = {
        "sub": subject,   # account.uid 
        "role": role,    
        "typ": "access",
        "iat": now,
        "exp": exp,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(*, subject: str, token_version: int) -> str:
    now = utcnow()
    exp = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    claims: Dict[str, Any] = {
        "sub": subject,
        "typ": "refresh",
        "tv": token_version, 
        "iat": now,
        "exp": exp,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str, *, expected_type: Optional[TokenType] = None) -> Dict[str, Any]:
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

    if expected_type is not None and payload.get("typ") != expected_type:
        raise JWTError(f"Wrong token type: expected {expected_type}")

    if not payload.get("sub"):
        raise JWTError("Missing subject (sub)")

    return payload