from __future__ import annotations
from typing import Annotated, Literal, Union, Optional
from pydantic import BaseModel, EmailStr, Field

from app.modules.students.schemas import StudentCreate
from app.modules.alumni.schemas import AlumniCreate
from app.modules.accounts.constants import UserRole
from app.modules.accounts.schemas import UserMe

class VerificationRequired(BaseModel):
    status: Literal["verification_required"] = "Verification Required"


### REGISTRATION SCHEMAS ###
class RegisterBase(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    timezone: str | None = Field(default="America/Toronto", max_length=50)

class StudentRegister(RegisterBase):
    role: Literal[UserRole.STUDENT]
    profile: StudentCreate

class AlumniRegister(RegisterBase):
    role: Literal[UserRole.ALUMNI]
    profile: AlumniCreate


RegisterRequest = Annotated[
    Union[StudentRegister, AlumniRegister],
    Field(discriminator="role"),
]

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"


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

class LoginNeedsVerification(BaseModel):
    status: Literal["verification_required"] = "Verification Required"

LoginResponse = Union[LoginSuccess, VerificationRequired]

### REFRESH SCHEMA ###
class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshSuccess(BaseModel):
    tokens: TokenPair

### OAUTH SCHEMAS ###
OAuthProvider = Literal["google", "linkedin", "apple"]

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
