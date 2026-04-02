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

    for key in ("role", "has_password", "has_profile"):
        base.pop(key, None)

    has_password = _has_password(account)
    role = account.role

    if role == UserRole.STUDENT:
        prof_obj = getattr(account, "student_profile", None) or (
            db.query(StudentProfile)
            .filter(StudentProfile.uid == account.uid)
            .first()
        )

        profile = (
            StudentMe(
                **base,
                role=UserRole.STUDENT,
                has_password=has_password,
                has_profile=True,
                student_profile=StudentPublic.model_validate(prof_obj),
            )
            if prof_obj
            else None
        )

        return UserMe(
            uid=account.uid,
            email=account.email,
            role=UserRole.STUDENT,
            has_password=has_password,
            has_profile=bool(prof_obj),
            profile=profile,
        )

    if role == UserRole.ALUMNI:
        prof_obj = getattr(account, "alumni_profile", None) or (
            db.query(AlumniProfile)
            .filter(AlumniProfile.uid == account.uid)
            .first()
        )

        profile = (
            AlumniMe(
                **base,
                role=UserRole.ALUMNI,
                has_password=has_password,
                has_profile=True,
                alumni_profile=AlumniPublic.model_validate(prof_obj),
            )
            if prof_obj
            else None
        )

        return UserMe(
            uid=account.uid,
            email=account.email,
            role=UserRole.ALUMNI,
            has_password=has_password,
            has_profile=bool(prof_obj),
            profile=profile,
        )

    if role == UserRole.ADMIN:
        prof_obj = getattr(account, "admin_profile", None)

        profile = AdminMe(
            **base,
            role=UserRole.ADMIN,
            has_password=has_password,
            has_profile=bool(prof_obj),
            admin_profile=AdminPublic.model_validate(prof_obj) if prof_obj else None,
        )

        return UserMe(
            uid=account.uid,
            email=account.email,
            role=UserRole.ADMIN,
            has_password=has_password,
            has_profile=bool(prof_obj),
            profile=profile,
        )

    raise HTTPException(status_code=400, detail="Unsupported role")