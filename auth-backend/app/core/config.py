import os
from functools import lru_cache
from typing import List, Union

from pydantic import AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings


ENV = os.getenv("ENVIRONMENT", "development")


class CommonSettings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 7 days
    CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["http://localhost:3000"]

    class Config:
        case_sensitive = True


class DevelopmentSettings(CommonSettings):

    DATABASE_URL: str


    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: SecretStr
    SECRET_KEY: SecretStr

    class Config:
        env_file = ".env.development"
        case_sensitive = True


class DockerSettings(CommonSettings):

    DATABASE_URL: str


    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: SecretStr
    SECRET_KEY: SecretStr

    class Config:
        env_file = ".env.docker"
        case_sensitive = True


class ProductionSettings(CommonSettings):

    DATABASE_URL: str
    ADMIN_USERNAME: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: SecretStr
    SECRET_KEY: SecretStr

    class Config:
        env_file = ".env.production"
        case_sensitive = True


@lru_cache
def get_settings():
    if ENV == "production":
        return ProductionSettings()
    elif ENV == "docker":
        return DockerSettings()
    else:
        return DevelopmentSettings()


settings = get_settings()