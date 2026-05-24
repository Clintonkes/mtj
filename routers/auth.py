from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from auth import verify_password, create_access_token, get_password_hash, get_current_admin
import models
import schemas

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate admin. Credentials MUST NOT be sent in URL params.
    Uses POST body via OAuth2PasswordRequestForm.
    """
    admin = db.query(models.Admin).filter(
        models.Admin.username == form_data.username
    ).first()
    # Use constant-time comparison via passlib to prevent timing attacks
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        # Generic message — do not leak whether username or password failed
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(current_admin: models.Admin = Depends(get_current_admin)):
    """
    Logout endpoint. Instructs client to discard the token.
    TODO(security): Implement token blacklisting (Redis) for true server-side invalidation.
    """
    return {"message": "Logged out successfully. Please discard your token."}


@router.get("/me", response_model=schemas.AdminOut)
def get_me(current_admin: models.Admin = Depends(get_current_admin)):
    return current_admin
