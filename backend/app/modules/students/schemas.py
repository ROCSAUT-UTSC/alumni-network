from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Dict, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)

    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: EmailStr

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    avatar_url: Optional[str] = Field(default=None, max_length=512)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    alumni_to_be: Optional[bool] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    
    pronouns: Optional[str] = Field(default=None, max_length=50)

    school_email: Optional[EmailStr] = None

    university: Optional[str] = Field(default=None, max_length=150)
    major: Optional[str] = Field(default=None, max_length=120)
    graduation_year: Optional[int] = Field(default=None, ge=1900, le=2100)
    image_url: Optional[str] = Field(default=None, max_length=300)

    bio: Optional[str] = Field(default=None, max_length=500)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)

    alumni_to_be: Optional[bool] = None


class StudentPublic(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    uid: uuid.UUID
    promoted_to_alumni_at: Optional[datetime] = None
    avatar_updated_at: Optional[datetime] = None


class StudentAvatarUploadInitRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=3, max_length=100)  # "image/png", "image/jpeg"
    file_size: int = Field(ge=1, le=10 * 1024 * 1024)        # 10MB max


class StudentAvatarUploadInitResponse(BaseModel):
    """
    For presigned PUT uploads:
    - client uploads bytes to upload_url with headers (if any)
    - then calls confirm with the returned key
    """
    upload_url: str
    method: Literal["PUT"] = "PUT"
    headers: Dict[str, str] = Field(default_factory=dict)

    key: str
    expires_in: int


class StudentAvatarConfirmRequest(BaseModel):
    key: str = Field(min_length=1, max_length=512)


class StudentAvatarRemoveResponse(BaseModel):
    ok: bool = True
