from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from typing import Iterable
from app.modules.auth.deps import get_db, get_current_user
from sqlalchemy.orm import Session
from app.models.user import AccountUser, StudentProfile, AlumniProfile
from app.modules.students.schemas import StudentPublic
from app.modules.alumni.schemas import AlumniPublic
from app.modules.accounts.constants import UserRole


def _is_admin(user: AccountUser = Depends(get_current_user)) -> AccountUser:
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin accounts can access this resource.",
        )
    return user


router = APIRouter(prefix="/admin", tags=["admin"],dependencies=[Depends(_is_admin)])

@router.get("/all-students", response_model=Iterable[StudentPublic])
def get_all_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Iterable[StudentProfile]:
    """
    Get all student profiles.
    """
    profiles = (
        db.query(StudentProfile)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return profiles

@router.get("/all-alumni", response_model=Iterable[AlumniPublic])
def get_all_alumni(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Iterable[AlumniPublic]:
    """
    Get all alumni profiles.
    """
    profiles = (
        db.query(AlumniProfile)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return profiles