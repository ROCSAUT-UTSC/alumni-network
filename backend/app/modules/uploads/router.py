from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.modules.auth.deps import get_db, get_current_user
from sqlalchemy.orm import Session
from app.models.user import AccountUser, StudentProfile
#from starlette.formparsers import MultiPartParsor
from app.modules.students.router import _get_student_profile, _is_student
from app.modules.alumni.router import _get_alumni_profile, _is_alumni
import os
router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 # 5MB


def _validate_(
    max_size : int,
    image:UploadFile=File(...),
):
  if image.content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
  #if not image.filename.endswith(['.jpeg', '.png', 'webp'])
    raise HTTPException(
            status_code=status.HTTP_400_FORBIDDEN,
            detail="Wrong file type, please upload jpeg, png or webp.",
            )
  # MultiPartParsor.max_file_size = max_size
  # if not image._in_memory:
  #   raise HTTPException(
  #         status_code=status.HTTP_400_FORBIDDEN,
  #         detail="The image file is too large, please upload image under 5MB",
  #         )
  
#No initial profile image in studentcreate
@router.post('/image', response_model = StudentProfile)
async def upload_student_image(
  image:UploadFile=File(...), #File(None) Optional
  db:  Session = Depends(get_db),
  user: AccountUser = Depends(get_current_user),
) -> StudentProfile:
  
  _is_student(user)

  profile = _get_student_profile(db, user.uid)

  _validate_(MAX_IMAGE_SIZE_BYTES, image)

  upload_directory = "./uploads"
  image_url = f"{upload_directory}/{image.filename}"
  #upload it in disk
  os.makedirs(upload_directory, exist_ok=True)
  with open(image_url, "wb") as buffer:
        buffer.write(await image.read())

  profile.avatar_url = image_url

  db.add(profile)
  db.commit()
  db.refresh(profile)

  return profile
  
