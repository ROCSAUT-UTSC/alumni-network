from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


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

    user: "AccountUser" = Relationship(back_populates="student_profile")
