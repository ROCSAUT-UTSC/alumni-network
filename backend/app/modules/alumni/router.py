from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.modules.auth.deps import get_db, get_current_user

router = APIRouter(prefix="/alumni", tags=["alumni"])