from fastapi import APIRouter

router = APIRouter(prefix="/systems", tags=["systems"])

@router.get("/health")
def health_check():
    return {"status": "ok"}
