from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel

from app.modules.systems.utils import utcnow


class AccountIdentity(SQLModel, table=True):
    __tablename__ = "account_identity"
    __table_args__ = (
        UniqueConstraint("provider", "provider_sub"),
        UniqueConstraint("user_uid", "provider"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_uid: uuid.UUID = Field(foreign_key="account_user.uid", index=True)

    provider: str = Field(max_length=30, index=True)
    provider_sub: str = Field(max_length=255, index=True)
    provider_email: Optional[EmailStr] = Field(default=None, max_length=255)

    created_at: datetime = Field(default_factory=utcnow, index=True)
