import os
from functools import lru_cache
from app.models.user import StudentProfile,AlumniProfile
from app.modules.accounts.constants import UserRole

class Settings:
    PROJECT_NAME: str = "Alumni Platform API"
    BACKEND_CORS_ORIGINS: list[str] = ["*"] 

    # DB 
    POSTGRES_USER: str = os.environ["POSTGRES_USER"]
    POSTGRES_PASSWORD: str = os.environ["POSTGRES_PASSWORD"]
    POSTGRES_DB: str = os.environ["POSTGRES_DB"]
    POSTGRES_HOST: str = os.environ["POSTGRES_HOST"] 
    POSTGRES_PORT: str = os.environ["POSTGRES_PORT"] 
    DATABASE_URL: str = os.environ["DATABASE_URL"] 

    # User Profiles
    PROFILE_MODEL = {
        UserRole.STUDENT: StudentProfile,
        UserRole.ALUMNI: AlumniProfile,
    }

    # Email
    FRONTEND_URL: str = os.environ["FRONTEND_URL"]
    RESEND_API_KEY: str = os.environ["RESEND_API_KEY"]
    VERIFY_RESEND_COOLDOWN_SECONDS: int = 60
    REQUIRE_VERIFY: bool = True
    
    # JWT
    JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # OAuth
    OAUTH_REDIRECT_URI: str = "http://localhost:3000/oauth/callback"
    OAUTH_STATE_TTL_SECONDS : int = 600
    GOOGLE_CLIENT_ID: str = os.environ["GOOGLE_CLIENT_ID"]
    GOOGLE_CLIENT_SECRET: str = os.environ["GOOGLE_CLIENT_SECRET"]
    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"


@lru_cache
def get_settings():
    return Settings()
