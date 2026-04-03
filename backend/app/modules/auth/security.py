import secrets
import bcrypt
import hashlib
import hmac
import uuid
from jose import jwt, JWTError
from typing import Any, Dict, Literal, Optional
from datetime import timedelta,datetime


from app.modules.systems.utils import utcnow
from app.modules.systems.config import get_settings

settings = get_settings()

TokenType = Literal["access", "refresh", "verify"]

def hash_password(password: str) -> str:
    prehashed = hashlib.sha256(password.encode('utf-8')).digest()
    return bcrypt.hashpw(prehashed, bcrypt.gensalt()).decode('utf-8')
def verify_password(password: str, hashed: str) -> bool:
    prehashed = hashlib.sha256(password.encode('utf-8')).digest()
    return bcrypt.checkpw(prehashed, hashed.encode('utf-8'))

def _hash_jti(jti: str) -> str:
    return hmac.new(
        settings.JWT_SECRET_KEY.encode("utf-8"),
        jti.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

def create_access_token(*, subject: str, role: str) -> str:
    now = utcnow()
    exp = now + timedelta(minutes=getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 30))

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
    exp = now + timedelta(days=getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 30))

    claims: Dict[str, Any] = {
        "sub": subject,
        "typ": "refresh",
        "tv": token_version, 
        "iat": now,
        "exp": exp,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_email_verify_token(*, subject: str) -> tuple[str, str, Any]:
    """
    Returns (token, jti_hash_to_store, expires_at)
    """
    now = utcnow()
    exp = now + timedelta(minutes=getattr(settings, "VERIFY_TOKEN_EXPIRE_MINUTES", 30))
    jti = secrets.token_urlsafe(16)

    claims: Dict[str, Any] = {
        "sub": subject,     # str(account.uid)
        "typ": "verify",
        "jti": jti,
        "iat": now,
        "exp": exp,
    }
    token = jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, _hash_jti(jti), exp

def decode_token(token: str, *, expected_type: Optional[TokenType] = None) -> Dict[str, Any]:
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

    if expected_type is not None and payload.get("typ") != expected_type:
        raise JWTError(f"Wrong token type: expected {expected_type}")

    if not payload.get("sub"):
        raise JWTError("Missing subject (sub)")

    return payload

def hash_verify_jti(jti: str) -> str:
    return _hash_jti(jti)


def create_password_reset_token(*, subject: str) -> tuple[str, str, datetime]:
    now = utcnow()
    exp = now + timedelta(hours=1)
    jti = str(uuid.uuid4())

    payload = {
        "sub": subject,
        "jti": jti,
        "typ": "password_reset",
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return token, _hash_jti(jti), exp


def decode_password_reset_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise ValueError("Invalid or expired reset token") from exc

    if payload.get("typ") != "password_reset":
        raise ValueError("Invalid reset token type")

    return payload
