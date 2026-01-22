from __future__ import annotations

import uuid
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class AdminProfile(SQLModel, table=True):
    __tablename__ = "admin_profile"

    uid: uuid.UUID = Field(foreign_key="account_user.uid", primary_key=True)
    display_name: Optional[str] = Field(default=None, max_length=120)

    user: "AccountUser" = Relationship(back_populates="admin_profile")
