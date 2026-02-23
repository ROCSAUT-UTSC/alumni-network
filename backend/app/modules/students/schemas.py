from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Dict, Literal, List

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)

    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: EmailStr
    location: Optional[str] = Field(default=None, max_length=120)

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    avatar_url: Optional[str] = Field(default=None, max_length=512)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    skills: Optional[List[str]] = Field(default=None, max_length=50)

    alumni_to_be: Optional[bool] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)

    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: Optional[EmailStr] = None
    location: Optional[str] = Field(default=None, max_length=120)

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    image_url: Optional[str] = Field(default=None, max_length=300)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    skills: Optional[List[str]] = Field(default=None, max_length=50)

    alumni_to_be: Optional[bool] = None


class StudentPublic(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    uid: uuid.UUID
    promoted_to_alumni_at: Optional[datetime] = None
    avatar_updated_at: Optional[datetime] = None