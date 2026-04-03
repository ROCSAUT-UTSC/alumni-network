from __future__ import annotations

import uuid
from typing import Optional, Iterable, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.modules.accounts.constants import UserRole
from app.models.user import *
from app.modules.admin.schemas import *
from app.modules.accounts.schemas import *
from app.modules.students.schemas import *
from app.modules.alumni.schemas import *
from app.modules.students.router import _get_student_profile
from app.modules.auth.deps import get_db, get_current_user
from app.modules.systems.utils import utcnow

router = APIRouter(prefix="/admin", tags=["admin"])

fake_uid = uuid.UUID("7529b66c-8aa7-4024-bb64-96c1816c3393")
fake_user = AccountUser(
        uid=fake_uid,
        email="testing@example.com",
        role=UserRole.STUDENT,
        is_active=True,
        is_verified=True,
        created_at=utcnow(),
        updated_at=utcnow(),
    )

def _get_user_profile(db: Session, user_uid: uuid.UUID) -> AccountUser:
    profile: Optional[AccountUser] = (
        db.query(AccountUser)
        .filter(AccountUser.uid == user_uid)
        .first()
    )
    if not profile:
      raise HTTPException(
          status_code=status.HTTP_404_NOT_FOUND,
          detail="Account profile not found.",
      )
    return profile

#----------------------------------------------------------------------------------
@router.get("/accounts/all", response_model=Iterable[AccountPublic])
def get_all_accounts(
    offset :int,
    limit : int,
    is_active : Optional[bool] = None,
    is_verified : Optional[bool] = None,
    role : Optional[str] = None,
    db: Session = Depends(get_db),
) -> Iterable[AccountPublic]: #Make some examples of the input and output
    profiles = db.query(AccountUser)

    if is_active is not None:
        profiles = profiles.filter(AccountUser.is_active == is_active)
    if is_verified is not None:
        profiles = profiles.filter(AccountUser.is_verified == is_verified)
    if role:
        if role not in (UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN):
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = 'Please enter either student, alumni, or admin'
            )
        profiles = profiles.filter(AccountUser.role == role)
    
    profiles = profiles.offset(offset).limit(limit).all()

    return profiles

@router.get("/accounts/{account_uid}", response_model=AccountPublic)
def get_account_by_id(
  account_uid: uuid.UUID,
  db: Session = Depends(get_db),
) -> AccountPublic:
  return _get_user_profile(db, account_uid)

@router.patch("/accounts/{account_uid}/deactivate", response_model=AccountPublic)
def deactivate_account(
   account_uid:uuid.UUID,
   db:Session = Depends(get_db),
   user: AccountUser = Depends(get_current_user) 
) -> AccountPublic:
    profile = _get_user_profile(db, account_uid)
    profile.is_active = False
    db.commit()
    db.refresh(profile)
    return profile

@router.patch("/accounts/{account_uid}/reactivate", response_model=AccountPublic)
def reactivate_account(
   account_uid:uuid.UUID,
   db: Session = Depends(get_db),
   user: AccountUser = Depends(get_current_user)
) -> AccountPublic:
    profile = _get_user_profile(db, account_uid)
    profile.is_active = True
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/accounts/{student_uid}/convert_to_alumni", response_model=AlumniPublic)
def promote_student_to_alumni(
    account_uid : uuid.UUID,
    student_to_alumni: AlumniFromStudentCreate,
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user)
) -> AlumniPublic:
   #Didn't check if user.uid == account_uid

   #Check student exists
    if user.role != UserRole.STUDENT:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Student profile not found.",
        )
    
    # student = user.student_profile
    student = _get_student_profile(db, account_uid)
    if not student.alumni_to_be:
        raise HTTPException(
        status_code=status.HTTP_412_Precondition_Failed,
        detail="Student does not want to be an Alumni.",
        ) 
   #Create AlumniProfile (Database)
    #Check if it is an alumni already
    alumni: Optional[AlumniProfile] = (
        db.query(AlumniProfile)
        .filter(AlumniProfile.uid == account_uid)
        .first()
    )

    update_data = student_to_alumni.model_dump(exclude_unset=True)
    if alumni is not None: #update
        for field, value in update_data.items():
            if hasattr(alumni, field):
                setattr(alumni, field, value)
    else:
        #create a new Alumni

        alumni = AlumniProfile(
            uid=account_uid,
            first_name = student.first_name,
            last_name = student.last_name,
            pronouns=student.pronouns,
            location = student.location,
            avatar_url = student.avatar_url,
            linkedin = student.linkedin,
            personal_website = student.personal_website,
            skills = student.skills,
            **student_to_alumni.model_dump(exclude_unset=True),
            is_active = True
        )

        db.add(alumni)
        student.promoted_to_alumni_at = utcnow()
    db.commit()
    db.refresh(alumni)
        # student.is_active = False

    return alumni
    