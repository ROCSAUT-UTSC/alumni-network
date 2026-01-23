import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum

from app.modules.accounts.constants import UserRole
from app.models.utils import utcnow


class AccountUser(SQLModel, table=True):
    __tablename__ = "account_user"

    uid: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(index=True, unique=True, max_length=255)
    password_hash: Optional[str] = Field(default=None, max_length=255)

    timezone: Optional[str] = Field(default="UTC", max_length=50)

    role: UserRole = Field(
        sa_column=Column(SAEnum(UserRole, name="user_role"), nullable=False),
        default=UserRole.STUDENT,
    )
    is_active: bool = Field(default=False)
    is_verified: bool = Field(default=False)

    created_at: datetime = Field(default_factory=utcnow, index=True)
    last_login_at: datetime = Field(default_factory=utcnow, index=True)
    updated_at: datetime = Field(default_factory=utcnow, index=True)
    deleted_at: Optional[datetime] = Field(default=None, index=True)

    last_password_reset_request: Optional[datetime] = None
    last_activation_email_sent: Optional[datetime] = None

    token_version: int = Field(default=0)

    student_profile: Optional["StudentProfile"] = Relationship(back_populates="account", sa_relationship_kwargs={"uselist": False},)
    alumni_profile: Optional["AlumniProfile"] = Relationship(back_populates="account",  sa_relationship_kwargs={"uselist": False},)
    admin_profile: Optional["AdminProfile"] = Relationship(back_populates="account",  sa_relationship_kwargs={"uselist": False},)

class StudentProfile(SQLModel, table=True):
    __tablename__ = "student_profile"

    uid: uuid.UUID = Field(foreign_key="account_user.uid", primary_key=True)

    first_name: str = Field(min_length=1, max_length=100, index=True)
    last_name: str = Field(min_length=1, max_length=100, index=True)
    preferred_name: Optional[str] = Field(default=None, max_length=100)
    pronouns: Optional[str] = Field(default=None, max_length=50)

    avatar_key: Optional[str] = Field(default=None, max_length=512)
    avatar_url: Optional[str] = Field(default=None, max_length=512)
    avatar_updated_at: Optional[datetime] = Field(default=None, index=True)

    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    major: Optional[str] = Field(default=None, max_length=120)
    university: Optional[str] = Field(default=None, max_length=150)
    school_email: EmailStr = Field(unique=True, index=True, max_length=255)

    alumni_to_be: Optional[bool] = Field(default=None)
    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    promoted_to_alumni_at: Optional[datetime] = Field(default=None, index=True)

    account: "AccountUser" = Relationship(back_populates="student_profile")

class AlumniProfile(SQLModel, table=True):
    __tablename__ = "alumni_profile"

    uid: uuid.UUID = Field(
        foreign_key="account_user.uid",
        primary_key=True,
    )

    first_name: str = Field(min_length=1, max_length=100, index=True)
    last_name: str = Field(min_length=1, max_length=100, index=True)
    pronouns: Optional[str] = Field(default=None, max_length=50)
    
    avatar_key: Optional[str] = Field(default=None, max_length=512)
    avatar_url: Optional[str] = Field(default=None, max_length=512)
    avatar_updated_at: Optional[datetime] = Field(default=None, index=True)

    industry: str = Field(min_length=1, max_length=120)

    bio: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=120)
    position: Optional[str] = Field(default=None, max_length=120)

    work_duration_months:  Optional[int] = Field(default=None, ge=0, le=60*12) # store in months
    academic_history: Optional[str] = Field(default=None, max_length=500)
    graduated_from: Optional[str] = Field(default=None, max_length=150)
    graduated_at_year: Optional[int] = Field(default=None, ge=1900, le=2100)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)
    company_website: Optional[str] = Field(default=None, max_length=300)

    account: "AccountUser" = Relationship(back_populates="alumni_profile")

class AdminProfile(SQLModel, table=True):
    __tablename__ = "admin_profile"

    uid: uuid.UUID = Field(foreign_key="account_user.uid", primary_key=True)
    display_name: Optional[str] = Field(default=None, max_length=120)

    account: "AccountUser" = Relationship(back_populates="admin_profile")
