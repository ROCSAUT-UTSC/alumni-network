from sqlmodel import SQLModel

Base = SQLModel

from app.models import (  # noqa
    user,
    student,
    alumni,
    admin,
    account_identity,
    refresh_session,
)

