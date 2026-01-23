from sqlmodel import SQLModel

Base = SQLModel

from app.models import ( 
    user,
    student,
    alumni,
    admin,
    account_identity,
    refresh_session,
)

