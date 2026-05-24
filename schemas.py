from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


# ── Auth ─────────────────────────────────────────────────────────────────────

class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    password: str = Field(..., min_length=8, max_length=128)


class AdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v


class AdminOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Booking ───────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=128)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=32)
    address: str = Field(..., min_length=5, max_length=256)
    service_type: str = Field(..., min_length=2, max_length=128)
    preferred_date: str = Field(..., max_length=32)
    preferred_time: str = Field(..., max_length=32)
    notes: Optional[str] = Field(None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)\+]", "", v)
        if not cleaned.isdigit():
            raise ValueError("Phone number must contain only digits and common separators")
        return v


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|completed|cancelled)$")


class BookingOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    address: str
    service_type: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Message ───────────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=128)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=32)
    subject: str = Field(..., min_length=3, max_length=256)
    body: str = Field(..., min_length=10, max_length=5000)


class MessageReply(BaseModel):
    reply: str = Field(..., min_length=1, max_length=5000)


class MessageOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    subject: str
    body: str
    status: str
    reply: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Testimonial ───────────────────────────────────────────────────────────────

class TestimonialCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=128)
    location: Optional[str] = Field(None, max_length=128)
    rating: int = Field(5, ge=1, le=5)
    body: str = Field(..., min_length=10, max_length=2000)
    service: Optional[str] = Field(None, max_length=128)


class TestimonialStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|published|unpublished)$")


class TestimonialOut(BaseModel):
    id: int
    customer_name: str
    location: Optional[str]
    rating: int
    body: str
    service: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Service ───────────────────────────────────────────────────────────────────

class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=128)
    description: str = Field(..., min_length=5, max_length=2000)
    icon: Optional[str] = Field(None, max_length=64)
    is_active: bool = True


class ServiceOut(BaseModel):
    id: int
    title: str
    description: str
    icon: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Gallery ───────────────────────────────────────────────────────────────────

class GalleryItemOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image_filename: str
    category: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class GalleryStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(published|unpublished)$")


# ── Site Settings ─────────────────────────────────────────────────────────────

class SettingUpdate(BaseModel):
    value: str = Field(..., max_length=5000)
