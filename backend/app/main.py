from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.systems.config import get_settings
from app.modules.systems.router import router as system_router
from app.modules.students.router import router as student_router
from app.modules.admins.router import router as admin_router
from app.modules.alumnis.router import router as alumni_router

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system_router)
app.include_router(student_router)
app.include_router(admin_router)
app.include_router(alumni_router)

@app.get("/")
def root():
    return {"message": "Alumni Platform API running"}
