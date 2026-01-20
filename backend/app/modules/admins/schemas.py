from __future__ import annotations

import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AdminPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uid: uuid.UUID
    display_name: Optional[str] = None


class AdminUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=120)
