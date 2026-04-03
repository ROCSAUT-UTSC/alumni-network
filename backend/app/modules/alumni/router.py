from __future__ import annotations

import uuid
from typing import Optional, Iterable, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.modules.accounts.constants import UserRole
from app.models.user import AccountUser, AlumniProfile
from app.modules.alumni.schemas import *
from app.modules.auth.deps import get_db, get_current_user
from app.modules.systems.utils import utcnow

router = APIRouter(prefix="/alumni", tags=["alumni"])

fake_uid = uuid.UUID("b4dc12c9-0236-4fee-a213-66268f052187")
fake_user = AccountUser(
        uid=fake_uid,
        email="user456@example.com",
        role=UserRole.ALUMNI,
        is_active=True,
        is_verified=True,
        created_at=utcnow(),
        updated_at=utcnow(),
    )

def _is_alumni(account: AccountUser) -> None:
    if account.role != UserRole.ALUMNI:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only alumni accounts can access this resource.",
        )
    
def _get_alumni_profile(db: Session, user_uid: uuid.UUID) -> AlumniProfile:
    profile: Optional[AlumniProfile] = (
        db.query(AlumniProfile)
        .filter(AlumniProfile.uid == user_uid)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumni profile not found.",
        )
    return profile

### Alumni Profile Routes ###
@router.post("/create_profile", response_model=AlumniPublic, status_code=status.HTTP_201_CREATED)
def create_alumni_profile(
    payload: AlumniCreate,
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user),
) -> AlumniPublic:
    """
    Create the current users's alumni profile.
    """
    _is_alumni(user)
    existing = (
        db.query(AlumniProfile)
        .filter(AlumniProfile.uid == user.uid)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Alumni profile already exists for this account.",
        )

    profile = AlumniProfile(
        uid=user.uid,
        **payload.model_dump(),
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get("/me", response_model=AlumniPublic)
def get_alumni(
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user),
) -> AlumniPublic:
    """
    Get the current alumni's profile.
    """
    _is_alumni(user)
    profile = _get_alumni_profile(db, user.uid)
    return profile

@router.patch("/me", response_model=AlumniPublic)
def update_alumni(
    payload: AlumniUpdate,
    db: Session = Depends(get_db),
    user: AccountUser = Depends(get_current_user),
) -> AlumniPublic:
    """
    Partially update the current alumni's profile.
    """
    _is_alumni(user)

    profile = _get_alumni_profile(db, user.uid)

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

@router.get("/{uid}", response_model=AlumniPublic)
def get_alumni_by_id(
    uid: uuid.UUID,
    db: Session = Depends(get_db),
) -> AlumniPublic:
    """
    Fetch an alumni profile by UID.
    """
    profile = _get_alumni_profile(db, uid)
    return profile

@router.get("/all", response_model=Iterable[AlumniPublic])
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