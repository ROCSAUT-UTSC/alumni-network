# backend/app/modules/systems/deps.py

from __future__ import annotations

import uuid
from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import AccountUser
from app.modules.accounts.constants import UserRole
from app.modules.systems.config import get_settings

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _raise_unauthorized(detail: str = "Invalid authentication credentials") -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AccountUser:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        sub = payload.get("sub")
        if not sub:
            _raise_unauthorized("Token missing subject")

        try:
            user_uid = uuid.UUID(sub)
        except ValueError:
            _raise_unauthorized("Invalid token subject")

    except JWTError:
        _raise_unauthorized("Invalid token")

    result = db.execute(select(AccountUser).where(AccountUser.uid == user_uid))
    user = result.scalar_one_or_none()
    if not user:
        _raise_unauthorized("User not found")

    # Optional: token version revocation support (only if you include "tv" in tokens)
    tv = payload.get("tv")
    if tv is not None and getattr(user, "token_version", None) is not None:
        if int(tv) != int(user.token_version):
            _raise_unauthorized("Token revoked")

    # Optional: block deleted users if you use soft-delete
    if getattr(user, "deleted_at", None) is not None:
        _raise_unauthorized("User disabled")

    return user


def require_admin(user: AccountUser = Depends(get_current_user)) -> AccountUser:
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return user


def require_student(user: AccountUser = Depends(get_current_user)) -> AccountUser:
    if user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student only")
    return user


def require_alumni(user: AccountUser = Depends(get_current_user)) -> AccountUser:
    if user.role != UserRole.ALUMNI:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Alumni only")
    return user
