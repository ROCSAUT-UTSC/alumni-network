import os
import time
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Literal
from PIL import Image
from io import BytesIO

from app.models.user import AccountUser, StudentProfile, AlumniProfile
from app.modules.auth.deps import get_db, get_current_user
from app.modules.accounts.schemas import UserMe
from app.modules.accounts.constants import UserRole
from app.modules.accounts.serivce import build_user_me
from app.modules.systems.storage import create_presigned_put_url, build_public_url, delete_object_by_url
from app.modules.uploads.schemas import *

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_BYTES = 5 * 1024 * 1024 # 5MB
EXPIRES_SECONDS = 600
MAX_DIMENSION = 512 
OUTPUT_FORMAT = "WEBP"
OUTPUT_QUALITY = 85


def validate_and_process_image(raw_bytes: bytes) -> tuple[bytes, str]:
    """
    Validates the uploaded image using Pillow.
    Resizes it and converts to WEBP.
    
    Returns:
        (processed_bytes, content_type)
    """

    try:
        image = Image.open(BytesIO(raw_bytes))
    except Exception:
        raise ValueError("Invalid image file")
    image.verify()
    image = Image.open(BytesIO(raw_bytes)).convert("RGB")
    image.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

    buffer = BytesIO()
    image.save(buffer, format=OUTPUT_FORMAT, quality=OUTPUT_QUALITY)

    return buffer.getvalue(), "image/webp"


@router.post("/init", response_model=AvatarUploadInitResponse)
def avatar_upload_init(
    payload: AvatarUploadInitRequest,
    account: AccountUser = Depends(get_current_user),
):
    if account.role not in (UserRole.STUDENT, UserRole.ALUMNI):
        raise HTTPException(status_code=403, detail="Role not supported")

    if payload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }[payload.content_type]

    key = f"avatars/{account.uid}/{uuid.uuid4()}.{ext}"

    upload_url, expires_in, headers = create_presigned_put_url(
        key=key,
        content_type=payload.content_type,
        expires_in=EXPIRES_SECONDS,
    )

    return AvatarUploadInitResponse(
        upload_url=upload_url,
        method="PUT",
        headers=headers,
        key=key,
        expires_in=expires_in,
    )


@router.post("/confirm", response_model=UserMe)
def avatar_confirm(
    payload: AvatarConfirmRequest,
    db: Session = Depends(get_db),
    account: AccountUser = Depends(get_current_user),
):
    key = payload.key.strip()
    expected_prefix = f"avatars/{account.uid}/"

    if not key.startswith(expected_prefix):
        raise HTTPException(status_code=400, detail="Invalid avatar key")

    avatar_url = build_public_url(key)

    if account.role == UserRole.STUDENT:
        prof = db.query(StudentProfile).filter(
            StudentProfile.uid == account.uid
        ).first()
    elif account.role == UserRole.ALUMNI:
        prof = db.query(AlumniProfile).filter(
            AlumniProfile.uid == account.uid
        ).first()
    else:
        raise HTTPException(status_code=403, detail="Unsupported role")

    if not prof:
        raise HTTPException(status_code=500, detail="Profile missing")

    if prof.avatar_url:
        delete_object_by_url(prof.avatar_url)

    prof.avatar_url = avatar_url
    db.add(prof)
    db.commit()
    db.refresh(account)

    return build_user_me(db, account)

@router.delete("", response_model=AvatarRemoveResponse)
def avatar_remove(
    db: Session = Depends(get_db),
    account: AccountUser = Depends(get_current_user),
):
    if account.role == UserRole.STUDENT:
        prof = db.query(StudentProfile).filter(
            StudentProfile.uid == account.uid
        ).first()
    elif account.role == UserRole.ALUMNI:
        prof = db.query(AlumniProfile).filter(
            AlumniProfile.uid == account.uid
        ).first()
    else:
        raise HTTPException(status_code=403, detail="Unsupported role")

    if not prof:
        raise HTTPException(status_code=500, detail="Profile missing")

    if prof.avatar_url:
        delete_object_by_url(prof.avatar_url)

    prof.avatar_url = None
    db.add(prof)
    db.commit()

    return AvatarRemoveResponse(ok=True)