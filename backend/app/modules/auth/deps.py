from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from typing import Callable
from sqlalchemy import select
from sqlalchemy.orm import Session
import uuid

from app.db.session import SessionLocal
from app.models.user import AccountUser
from app.modules.systems.config import get_settings
from app.modules.auth.security import decode_token

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AccountUser:
    try:
        payload = decode_token(token, expected_type="access")
        user_uid = uuid.UUID(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.execute(select(AccountUser).where(AccountUser.uid == user_uid)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user

def require_roles(*allowed: str) -> Callable:
    allowed_set = set(allowed)

    def _dep(current_user: AccountUser = Depends(get_current_user)) -> AccountUser:
        role = getattr(current_user, "role", None)
        if role not in allowed_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return _dep