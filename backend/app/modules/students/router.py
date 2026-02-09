from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from typing import Optional, Iterable, Dict, Any
from app.modules.auth.deps import get_db, get_current_user
from sqlalchemy.orm import Session
from app.models.user import AccountUser, StudentProfile
from app.modules.students.schemas import *
from app.modules.accounts.constants import UserRole

router = APIRouter(prefix="/students", tags=["students"])

def _is_student(account: AccountUser) -> None:
    if account.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only student accounts can access this resource.",
        )

def _get_student_profile(db: Session, user_uid: uuid.UUID) -> StudentProfile:
    profile: Optional[StudentProfile] = (
        db.query(StudentProfile)
        .filter(StudentProfile.uid == user_uid)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )
    return profile

#------------------------------------------------------------------------------------------
@router.get("/me", response_model=StudentPublic)
def get_student_profile(
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user), 
) -> StudentPublic:
    """
    example:
    - Auth is enforced via get_current_user()
    - Later, Dev B swaps get_current_user() to JWT-based and this router stays unchanged.
    """
    _is_student(user)

    profile = _get_student_profile(db, user.uid)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )
    
    return profile

@router.post("/create_profile", response_model=StudentPublic, status_code=status.HTTP_201_CREATED)
def create_student_profile(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user),
) -> StudentPublic:
    """
    Create the current users's student profile.
    """
    _is_student(user)
    existing = user.student_profile

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student profile already exists for this account.",
        )

    profile = StudentProfile(
        uid=user.uid,
        **payload.model_dump(),
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile

@router.patch("/me", response_model=StudentPublic)
def update_student(
    payload: StudentUpdate,
    db: Session = Depends(get_db),
     user: AccountUser = Depends(get_current_user),
) -> StudentPublic:
    """
    Partially update the current student's profile.
    """
    _is_student(user)

    profile = _get_student_profile(db, user.uid)

    update_data = payload.model_dump(exclude_unset=True)

    image_url = update_data.pop("image_url", None)
    if image_url is not None:
        update_data["avatar_url"] = image_url

    for field, value in update_data.items():
        setattr(profile, field, value)


    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile

@router.get("/{uid}", response_model=StudentPublic)
def get_student_by_id(
    uid: uuid.UUID,
    db: Session = Depends(get_db),
) -> StudentPublic:
    """
    Fetch a student profile by UID.
    """
    profile = _get_student_profile(db, uid)
    return profile

@router.get("/all", response_model=Iterable[StudentPublic])
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
