from app.core.security import get_password_hash
from app.models.user import User
from app.db.session import SessionLocal
from app.core.config import settings

def init_admin():

    db = SessionLocal()
    try:

        admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if not admin:
            admin_user = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,

                hashed_password=get_password_hash(settings.ADMIN_PASSWORD.get_secret_value()),
                is_admin=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"Admin user '{settings.ADMIN_USERNAME}' created successfully")
        else:
            print(f"Admin user '{settings.ADMIN_USERNAME}' already exists")
    finally:
        db.close()