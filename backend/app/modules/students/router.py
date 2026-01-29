from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.modules.auth.deps import get_db, get_current_user
from sqlalchemy.orm import Session
from app.models.user import AccountUser
from app.models.user import AccountUser, StudentProfile
from app.modules.accounts.constants import UserRole
from app.modules.students.schemas import *
from app.modules.systems.utils import utcnow

router = APIRouter(prefix="/students", tags=["students"])

fake_uid = uuid.UUID("5e15150e-632b-41cd-a497-6a89550ffa91")
fake_user = AccountUser(
        uid=fake_uid,
        email="user456@example.com",
        role=UserRole.ALUMNI,
        is_active=True,
        is_verified=True,
        created_at=utcnow(),
        updated_at=utcnow(),
    )

def _is_student(account: AccountUser) -> None:
    if account.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only student accounts can access this resource.",
        )

@router.get("/me", response_model=dict)

#------------------------------------------------------------------------------------------
def get_student_profile(
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user), 
):
    """
    example:
    - Auth is enforced via get_current_user()
    - Later, Dev B swaps get_current_user() to JWT-based and this router stays unchanged.
    """
    _is_student(user)

    profile = user.student_profile

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
    user: AccountUser = fake_user, #AccountUser = Depends(get_current_user),
) -> StudentPublic:
    """
    Create the current users's alumni profile.
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