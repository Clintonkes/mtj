from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum
import enum
from database import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    completed = "completed"
    cancelled = "cancelled"


class MessageStatus(str, enum.Enum):
    unread = "unread"
    read = "read"
    replied = "replied"


class TestimonialStatus(str, enum.Enum):
    pending = "pending"
    published = "published"
    unpublished = "unpublished"


class GalleryStatus(str, enum.Enum):
    published = "published"
    unpublished = "unpublished"


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    # Stores bcrypt hash only — never plaintext
    hashed_password = Column(String(256), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=False)
    address = Column(String(256), nullable=False)
    service_type = Column(String(128), nullable=False)
    preferred_date = Column(String(32), nullable=False)
    preferred_time = Column(String(32), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=True)
    subject = Column(String(256), nullable=False)
    body = Column(Text, nullable=False)
    status = Column(Enum(MessageStatus), default=MessageStatus.unread, nullable=False)
    reply = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(128), nullable=False)
    location = Column(String(128), nullable=True)
    rating = Column(Integer, default=5)
    body = Column(Text, nullable=False)
    service = Column(String(128), nullable=True)
    status = Column(Enum(TestimonialStatus), default=TestimonialStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(64), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class GalleryItem(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    # Stores UUID filename, never raw user input
    image_filename = Column(String(256), nullable=False)
    category = Column(String(64), nullable=True)
    status = Column(Enum(GalleryStatus), default=GalleryStatus.published, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(128), unique=True, nullable=False)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
