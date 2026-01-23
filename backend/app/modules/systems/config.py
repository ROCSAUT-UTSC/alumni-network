import os
from functools import lru_cache

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

    # Email
    RESEND_API_KEY: str = os.environ["RESEND_API_KEY"]
    EMAIL_FROM: str = os.environ["EMAIL_FROM"]
    
    # JWT
    JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))
@lru_cache
def get_settings():
    return Settings()
