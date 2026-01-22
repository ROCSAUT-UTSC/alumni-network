from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.modules.systems.deps import get_db, get_current_user, require_admin, DevUser
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admins", tags=["admins"])