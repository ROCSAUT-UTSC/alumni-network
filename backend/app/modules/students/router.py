from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
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
    # TODO: replace with real logic to fetch student profile from DB
    
    profile: Optional[StudentProfile] = (
        db.query(StudentProfile)
        .filter(StudentProfile.uid == user.uid)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )
    return profile
    ##Another way (Experiment)
    profile = user.student_profile
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )
    return profile

@router.post('/create_profile', response_model = StudentPublic,  status_code=status.HTTP_201_CREATED)  
def create_student_profile(
    payload: StudentCreate,
    db : Session=Depends(get_db),
    user: AccountUser = Depends(get_current_user),
)->StudentPublic:
    
    _is_student(user)

    existing = user.student_profile

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student profile already exists for this account.",
        )
    
    profile = StudentProfile(
        uid = user.uid,
        **payload.model_dump()
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)