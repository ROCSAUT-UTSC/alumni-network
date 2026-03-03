from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Dict, Literal, List

from pydantic import BaseModel, ConfigDict, Field

class AlumniBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    preferred_name: Optional[str] = Field(default=None, max_length=100)

    pronouns: Optional[str] = Field(default=None, max_length=50)
    industry: str = Field(min_length=1, max_length=120)

    bio: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=120)
    position: Optional[str] = Field(default=None, max_length=120)
    avatar_url: Optional[str] = Field(default=None, max_length=512)

    work_duration_months: Optional[int] = Field(default=None, ge=0, le=60 * 12)
    academic_history: Optional[str] = Field(default=None, max_length=500)

    graduated_from: Optional[str] = Field(default=None, max_length=150)
    graduated_at_year: Optional[int] = Field(default=None, ge=1900, le=2100)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)
    company_website: Optional[str] = Field(default=None, max_length=300)
    
    skills: Optional[List[str]] = Field(default=None, max_length=50)

class AlumniCreate(AlumniBase):
    pass


class AlumniUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    preferred_name: Optional[str] = Field(default=None, max_length=100)
    
    pronouns: Optional[str] = Field(default=None, max_length=50)
    industry: Optional[str] = Field(default=None, min_length=1, max_length=120)

    bio: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=120)
    position: Optional[str] = Field(default=None, max_length=120)

    work_duration_months: Optional[int] = Field(default=None, ge=0, le=60 * 12)
    academic_history: Optional[str] = Field(default=None, max_length=500)

    graduated_from: Optional[str] = Field(default=None, max_length=150)
    graduated_at_year: Optional[int] = Field(default=None, ge=1900, le=2100)

    linkedin: Optional[str] = Field(default=None, max_length=300)
    personal_website: Optional[str] = Field(default=None, max_length=300)
    company_website: Optional[str] = Field(default=None, max_length=300)
    
    skills: Optional[List[str]] = Field(default=None, max_length=50)

class AlumniPublic(AlumniBase):
    model_config = ConfigDict(from_attributes=True)
    uid: uuid.UUID
    avatar_updated_at: Optional[datetime] = None



class AlumniAvatarUploadInitRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=3, max_length=100)
    file_size: int = Field(ge=1, le=10 * 1024 * 1024)


class AlumniAvatarUploadInitResponse(BaseModel):
    upload_url: str
    method: Literal["PUT"] = "PUT"
    headers: Dict[str, str] = Field(default_factory=dict)

    key: str
    expires_in: int


class AlumniAvatarConfirmRequest(BaseModel):
    key: str = Field(min_length=1, max_length=512)


class AlumniAvatarRemoveResponse(BaseModel):
    ok: bool = True

