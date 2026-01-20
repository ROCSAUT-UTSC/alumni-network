import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from app.modules.accounts.constants import UserRole

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class AccountUser(SQLModel, table=True):
    __tablename__ = "account_user"

    uid: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(index=True, unique=True, max_length=255)
    password_hash: Optional[str] = Field(default=None, max_length=255) # Hashed password
    
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

### STUDENT PROFILE ###
class StudentProfile(SQLModel, table=True):
    __tablename__ = "student_profile"

    uid: uuid.UUID = Field(
        foreign_key="account_user.uid",
        primary_key=True,
    )

    first_name: str = Field(min_length=1, max_length=100, index=True)
    last_name: str = Field(min_length=1, max_length=100, index=True)
    preferred_name: Optional[str] = Field(default=None, max_length=100)
    pronouns: Optional[str] = Field(default=None, max_length=50)

    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    major: Optional[str] = Field(default=None, max_length=120)
    university: Optional[str] = Field(default=None, max_length=150)
    school_email: EmailStr = Field(unique=True, index=True, max_length=255)

    alumni_to_be: Optional[bool] = Field(default=None) # if student plans to become alumni
    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    promoted_to_alumni_at: Optional[datetime] = Field(default=None, index=True)

    user: AccountUser = Relationship(back_populates="student_profile")


### ALUMNI PROFILE ###
class AlumniProfile(SQLModel, table=True):
    __tablename__ = "alumni_profile"

    uid: uuid.UUID = Field(
        foreign_key="account_user.uid",
        primary_key=True,
    )

    first_name: str = Field(min_length=1, max_length=100, index=True)
    last_name: str = Field(min_length=1, max_length=100, index=True)
    pronouns: Optional[str] = Field(default=None, max_length=50)

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

    user: AccountUser = Relationship(back_populates="alumni_profile")


### ADMIN PROFILE ###
class AdminProfile(SQLModel, table=True):
    __tablename__ = "admin_profile"

    uid: uuid.UUID = Field(
        foreign_key="account_user.uid",
        primary_key=True,
    )
    display_name: Optional[str] = Field(default=None, max_length=120)
         
    user: AccountUser = Relationship(back_populates="admin_profile")


import uuid
from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import UniqueConstraint

class AccountIdentity(SQLModel, table=True):
    __tablename__ = "account_identity"
    __table_args__ = (
        UniqueConstraint("provider", "provider_sub"),
        UniqueConstraint("user_uid", "provider"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_uid: uuid.UUID = Field(foreign_key="account_user.uid", index=True)

    provider: str = Field(max_length=30, index=True)      # "google", "github"
    provider_sub: str = Field(max_length=255, index=True) # OAuth subject/user id
    provider_email: Optional[str] = Field(default=None, max_length=255)

    created_at: datetime = Field(default_factory=utcnow, index=True)
