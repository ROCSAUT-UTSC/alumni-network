import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

from app.models.user import AccountUser



def utcnow() -> datetime:
    return datetime.now(timezone.utc)

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

    user: AccountUser = Relationship(back_populates="alumni_profile")

