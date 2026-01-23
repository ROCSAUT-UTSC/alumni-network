from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.modules.auth.deps import get_db, get_current_user
from sqlalchemy.orm import Session
from app.models.user import AccountUser

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/me", response_model=dict)
def get_student_profile(
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user), 
):
    """
    example:
    - Auth is enforced via get_current_user()
    - Later, Dev B swaps get_current_user() to JWT-based and this router stays unchanged.
    """
    # TODO: replace with real logic to fetch student profile from DB
    return {"user_id": user.id, "role": str(user.role), "profile":""}
