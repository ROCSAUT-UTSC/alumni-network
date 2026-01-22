from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from app.modules.accounts.constants import UserRole
from app.models.utils import utcnow


class AccountUser(SQLModel, table=True):
    __tablename__ = "account_user"

    uid: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(index=True, unique=True, max_length=255)
    password_hash: Optional[str] = Field(default=None, max_length=255)

    timezone: Optional[str] = Field(default="UTC", max_length=50)

    role: UserRole = Field(default=UserRole.STUDENT, index=True)
    is_active: bool = Field(default=False)
    is_verified: bool = Field(default=False)

    created_at: datetime = Field(default_factory=utcnow, index=True)
    last_login_at: datetime = Field(default_factory=utcnow, index=True)
    updated_at: datetime = Field(default_factory=utcnow, index=True)
    deleted_at: Optional[datetime] = Field(default=None, index=True)

    last_password_reset_request: Optional[datetime] = None
    last_activation_email_sent: Optional[datetime] = None

    token_version: int = Field(default=0)

    student_profile: Optional["StudentProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )
    alumni_profile: Optional["AlumniProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )
    admin_profile: Optional["AdminProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False},
    )
