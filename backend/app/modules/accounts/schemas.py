from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Union, Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.accounts.constants import UserRole  # adjust to where your enum actually lives

from app.modules.students.schemas import StudentPublic
from app.modules.alumni.schemas import AlumniPublic
from app.modules.admins.schemas import AdminPublic


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AccountCreate(BaseModel):
    email: EmailStr
    password: Optional[str] = Field(default=None, min_length=8, max_length=255)
    timezone: str = Field(default="America/Toronto", max_length=50)


class AccountUpdate(BaseModel):
    timezone: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    role: Optional[UserRole] = None


class AccountPublic(ORMBase):
    uid: uuid.UUID
    email: EmailStr
    timezone: str

    role: UserRole
    is_active: bool
    is_verified: bool

    created_at: datetime
    last_login_at: Optional[datetime] = None
    updated_at: datetime

    has_password: bool = False


class AccountAdminPublic(AccountPublic):
    deleted_at: Optional[datetime] = None
    token_version: int = 0


class StudentMe(AccountPublic):
    role: Literal[UserRole.STUDENT]
    student_profile: StudentPublic


class AlumniMe(AccountPublic):
    role: Literal[UserRole.ALUMNI]
    alumni_profile: AlumniPublic


class AdminMe(AccountPublic):
    role: Literal[UserRole.ADMIN]
    admin_profile: Optional[AdminPublic] = None


UserMe = Annotated[Union[StudentMe, AlumniMe, AdminMe], Field(discriminator="role")]


class AccountWithProfilesAdmin(AccountAdminPublic):
    student_profile: Optional[StudentPublic] = None
    alumni_profile: Optional[AlumniPublic] = None
    admin_profile: Optional[AdminPublic] = None
