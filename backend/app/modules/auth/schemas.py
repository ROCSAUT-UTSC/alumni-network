from __future__ import annotations

from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field

from app.modules.students.schemas import StudentCreate
from app.modules.alumnis.schemas import AlumniCreate
from app.modules.accounts.schemas import UserMe

### JWT AUTH SCHEMAS ###
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)


class RegisterStudentRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    timezone: str = Field(default="America/Toronto", max_length=50)
    profile: StudentCreate


class RegisterAlumniRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    timezone: str = Field(default="America/Toronto", max_length=50)
    profile: AlumniCreate


class TokenResponse(BaseModel):
    """
    Access token returned in JSON.
    Refresh token should be set as an httpOnly cookie (recommended),
    not returned in the body.
    """
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int
    user: UserMe


class RefreshResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class LogoutResponse(BaseModel):
    ok: bool = True


### OAUTH SCHEMAS ###
OAuthProvider = Literal["google", "github"]


class OAuthAuthorizeResponse(BaseModel):
    authorization_url: str
    provider: OAuthProvider
    state: str


class OAuthExchangeRequest(BaseModel):
    provider: OAuthProvider
    code: str
    redirect_uri: str
    code_verifier: Optional[str] = None
    state: Optional[str] = None
