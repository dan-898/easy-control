import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints import employees
from app.core.config import get_settings
from app.core.init_db import init_admin
from app.db.session import get_db, engine
from app.models.user import User
from app.db.base import Base
from app.models import employee, user


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Admin Auth API",
    description="API for admin authentication",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api")
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])


@app.get("/")
async def root():
    return {"message": "Admin Authentication API"}

@app.get("/debug/settings")
async def debug_settings():

    return {
        "database_url": settings.DATABASE_URL.split("@")[-1] if settings.DATABASE_URL else None,
        "cors_origins": settings.CORS_ORIGINS,
        "admin_username": settings.ADMIN_USERNAME if hasattr(settings, "ADMIN_USERNAME") else "Not configured",
        "admin_email": settings.ADMIN_EMAIL if hasattr(settings, "ADMIN_EMAIL") else "Not configured",
        "env_file": settings.__config__.env_file if hasattr(settings.__config__, "env_file") else "Not specified"
    }

@app.get("/debug/db-users")
async def debug_db_users(db: Session = Depends(get_db)):

    try:
        users = db.query(User).all()
        return {"user_count": len(users), "users": [{"id": user.id, "username": user.username, "is_admin": user.is_admin} for user in users]}
    except Exception as e:
        logger.error(f"Database error: {e}")
        return {"error": str(e)}

@app.on_event("startup")
async def startup_db_client():
    logger.info("Starting up application...")
    logger.info(f"Environment: {settings.__class__.__name__}")

    logger.info(f"Secret Key type: {type(settings.SECRET_KEY)}")
    
    try:
        logger.info("Initializing admin user...")
        init_admin()
        logger.info("Admin initialization complete")
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        logger.exception("Detailed error information:")