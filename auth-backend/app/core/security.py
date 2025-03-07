from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(
        subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)


    secret_key = settings.SECRET_KEY.get_secret_value() if hasattr(settings.SECRET_KEY,
                                                                   'get_secret_value') else settings.SECRET_KEY

    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm="HS256")
    return encoded_jwt


def decode_token(token: str):

    try:

        secret_key = settings.SECRET_KEY.get_secret_value() if hasattr(settings.SECRET_KEY,
                                                                       'get_secret_value') else settings.SECRET_KEY

        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except JWTError:
        return None


def get_current_user(token: str = Depends(oauth2_scheme)):


    from app.models.user import get_user_by_username
    from app.schemas.token import TokenPayload

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    try:
        token_data = TokenPayload(**payload)

        if token_data.type != "access":
            raise credentials_exception


        if datetime.fromtimestamp(token_data.exp) < datetime.utcnow():
            raise credentials_exception


        user = get_user_by_username(token_data.sub)
        if user is None:
            raise credentials_exception

        return user
    except Exception:
        raise credentials_exception