from typing import Dict, Literal
from pydantic import BaseModel, Field

class AvatarUploadInitRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=3, max_length=100)
    file_size: int = Field(ge=1, le=10 * 1024 * 1024)

class AvatarUploadInitResponse(BaseModel):
    upload_url: str
    method: Literal["PUT"] = "PUT"
    headers: Dict[str, str] = Field(default_factory=dict)
    key: str
    expires_in: int

class AvatarConfirmRequest(BaseModel):
    key: str = Field(min_length=1, max_length=512)

class AvatarRemoveResponse(BaseModel):
    ok: bool = True
