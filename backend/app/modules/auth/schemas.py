from __future__ import annotations
from typing import Literal, Union, Optional
from pydantic import BaseModel, EmailStr, Field

from app.modules.accounts.constants import UserRole
from app.modules.accounts.schemas import UserMe

class VerificationRequired(BaseModel):
    status: Literal["verification_required"] = "Verification Required"

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"

### REGISTRATION SCHEMAS ###
class RegisterBase(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    timezone: str | None = Field(default="America/Toronto", max_length=50)

class RegisterRequest(RegisterBase):
    role: UserRole

class RegisterSuccess(BaseModel):
    user: UserMe
    tokens: TokenPair


RegisterResponse = Union[RegisterSuccess, VerificationRequired]

### LOGIN SCHEMAS ###
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)

class LoginSuccess(BaseModel):
    status: Literal["login_successful"] = "Login Successful"
    needs_profile: bool
    tokens: TokenPair

LoginResponse = Union[LoginSuccess, VerificationRequired]

### REFRESH SCHEMA ###
class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshSuccess(BaseModel):
    tokens: TokenPair

### OAUTH SCHEMAS ###
OAuthProvider = Literal["google", "linkedin", "apple"]
class OAuthAuthorizeRequest(BaseModel):
    role: Optional[UserRole] = None
    provider: OAuthProvider         
class OAuthAuthorizeResponse(BaseModel):
    authorization_url: str
    provider: OAuthProvider
    state: str

class OAuthExchangeRequest(BaseModel):
    provider: OAuthProvider
    code_verifier: Optional[str] = None
    code: str
    role: Optional[UserRole] = None
    state: Optional[str] = None

class OAuthLoginSuccess(BaseModel):
    status: Literal["login_successful"] = "Login Successful"
    tokens: TokenPair
    needs_profile: bool