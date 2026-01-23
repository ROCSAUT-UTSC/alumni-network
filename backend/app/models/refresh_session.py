from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel

from app.modules.systems.utils import utcnow


class RefreshSession(SQLModel, table=True):
    __tablename__ = "refresh_session"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_uid: uuid.UUID = Field(foreign_key="account_user.uid", index=True)

    token_hash: str = Field(max_length=128, index=True)
    created_at: datetime = Field(default_factory=utcnow, index=True)
    expires_at: datetime = Field(index=True)

    revoked_at: Optional[datetime] = Field(default=None, index=True)
    replaced_by: Optional[uuid.UUID] = Field(default=None, index=True)

    user_agent: Optional[str] = Field(default=None, max_length=300)
    ip: Optional[str] = Field(default=None, max_length=64)
