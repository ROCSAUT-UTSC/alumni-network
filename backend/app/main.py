from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.systems.config import get_settings
from app.modules.systems.router import router as system_router
from app.modules.students.router import router as student_router
from app.modules.admin.router import router as admin_router
from app.modules.alumni.router import router as alumni_router
from app.modules.auth.router import router as auth_router
from app.modules.uploads.router import router as upload_router

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(alumni_router, prefix="/api")
app.include_router(upload_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Alumni Platform API running"}
