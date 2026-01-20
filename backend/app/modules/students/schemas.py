
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Union, Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.accounts.models import UserRole

class StudentProfileBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)

    preferred_name: Optional[str] = Field(default=None, max_length=100)
    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: EmailStr

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    alumni_to_be: Optional[bool] = None


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)

    preferred_name: Optional[str] = Field(default=None, max_length=100)
    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: Optional[EmailStr] = None

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    alumni_to_be: Optional[bool] = None


class StudentProfilePublic(ORMBase, StudentProfileBase):
    uid: uuid.UUID
    promoted_to_alumni_at: Optional[datetime] = None