# backend/app/modules/systems/deps.py

from __future__ import annotations

import uuid
from typing import Generator
from dataclasses import dataclass

from fastapi import Depends, Query, HTTPException, status
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


@dataclass
class DevUser:
    id: int
    role: UserRole


def get_current_user(
    user_id: int = Query(1, ge=1, description="DEV ONLY: pretend logged-in user id"),
    role: UserRole = Query(UserRole.STUDENT, description="DEV ONLY: pretend logged-in role"),
) -> DevUser:
    return DevUser(id=user_id, role=role)


def require_role(*allowed: UserRole):
    def _dep(user: DevUser = Depends(get_current_user)) -> DevUser:
        if user.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user
    return _dep


def require_admin(user: DevUser = Depends(require_role(UserRole.ADMIN))) -> DevUser:
    return user


def require_student(user: DevUser = Depends(require_role(UserRole.STUDENT))) -> DevUser:
    return user


def require_alumni(user: DevUser = Depends(require_role(UserRole.ALUMNI))) -> DevUser:
    return user