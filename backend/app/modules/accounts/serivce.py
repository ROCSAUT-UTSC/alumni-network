from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.modules.accounts.constants import UserRole
from app.modules.accounts.schemas import AccountPublic, StudentMe, AlumniMe, AdminMe, UserMe
from app.modules.students.schemas import StudentPublic
from app.modules.alumni.schemas import AlumniPublic
from app.modules.admin.schemas import AdminPublic
from app.models.user import StudentProfile, AlumniProfile, AdminProfile

def _has_password(account) -> bool:
    return bool(getattr(account, "password_hash", None) or getattr(account, "hashed_password", None))


def build_user_me(db: Session, account) -> UserMe:
    base = AccountPublic.model_validate(account).model_dump()
    base["has_password"] = _has_password(account)

    role = account.role

    if role == UserRole.STUDENT:
        prof_obj = getattr(account, "student_profile", None) or (
            db.query(StudentProfile)
            .filter(StudentProfile.account_uid == account.uid)
            .first()
        )
        if not prof_obj:
            raise HTTPException(status_code=500, detail="Student profile missing for account")

        base["role"] = UserRole.STUDENT
        base["student_profile"] = StudentPublic.model_validate(prof_obj)
        return StudentMe(**base)

    if role == UserRole.ALUMNI:
        prof_obj = getattr(account, "alumni_profile", None) or (
            db.query(AlumniProfile)
            .filter(AlumniProfile.uid == account.uid)
            .first()
        )
        if not prof_obj:
            raise HTTPException(status_code=500, detail="Alumni profile missing for account")

        base["role"] = UserRole.ALUMNI
        base["alumni_profile"] = AlumniPublic.model_validate(prof_obj)
        return AlumniMe(**base)

    if role == UserRole.ADMIN:
        prof_obj = getattr(account, "admin_profile", None) or (
            db.query(AdminProfile)
            .filter(AdminProfile.uid == account.uid)
            .first()
        )

        base["role"] = UserRole.ADMIN
        base["admin_profile"] = AdminPublic.model_validate(prof_obj) if prof_obj else None
        return AdminMe(**base)

    raise HTTPException(status_code=400, detail="Unsupported role")
