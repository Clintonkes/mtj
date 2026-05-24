import os
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
import models

logger = logging.getLogger(__name__)

# ── Secret key resolution (never hardcoded) ────────────────────────────────────
# Resolution order: ENV → local file → ephemeral random (logs a warning)
def _get_secret_key() -> str:
    """
    Resolve the JWT secret key without hardcoding.
    TODO(security): In production on Railway, always set JWT_SECRET_KEY as an
    environment variable. Do NOT rely on the ephemeral fallback for prod.
    """
    env_key = os.environ.get("JWT_SECRET_KEY")
    if env_key:
        return env_key
    secret_file = os.path.join(os.path.dirname(__file__), "jwt_secret.txt")
    if os.path.exists(secret_file):
        with open(secret_file, "r") as f:
            return f.read().strip()
    ephemeral = secrets.token_hex(32)
    logger.warning(
        "JWT_SECRET_KEY not set. Generating ephemeral secret. "
        "Sessions will not persist across restarts. "
        "THIS IS NOT SUITABLE FOR PRODUCTION."
    )
    return ephemeral


SECRET_KEY = _get_secret_key()
ALGORITHM = "HS256"  # Hardcoded — never derived from unverified token
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    # Always use hardcoded algorithm — never accept 'none'
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = db.query(models.Admin).filter(models.Admin.username == username).first()
    if admin is None or not admin.is_active:
        raise credentials_exception
    return admin
