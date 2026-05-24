import os
import uuid
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from auth import get_current_admin
import models
import schemas

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/content", tags=["content"])

UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ── Testimonials ──────────────────────────────────────────────────────────────

@router.post("/testimonials", response_model=schemas.TestimonialOut, status_code=201)
def create_testimonial(data: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    """Public: submit a testimonial (starts as pending)."""
    t = models.Testimonial(**data.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/testimonials", response_model=List[schemas.TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    """Public: published testimonials only."""
    return (
        db.query(models.Testimonial)
        .filter(models.Testimonial.status == models.TestimonialStatus.published)
        .order_by(models.Testimonial.created_at.desc())
        .all()
    )


@router.get("/testimonials/all", response_model=List[schemas.TestimonialOut])
def list_all_testimonials(
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    """Admin: all testimonials including pending."""
    return db.query(models.Testimonial).order_by(models.Testimonial.created_at.desc()).all()


@router.patch("/testimonials/{tid}/status", response_model=schemas.TestimonialOut)
def update_testimonial_status(
    tid: int,
    update: schemas.TestimonialStatusUpdate,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    t = db.query(models.Testimonial).filter(models.Testimonial.id == tid).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    t.status = update.status
    db.commit()
    db.refresh(t)
    return t


@router.delete("/testimonials/{tid}", status_code=204)
def delete_testimonial(
    tid: int,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    t = db.query(models.Testimonial).filter(models.Testimonial.id == tid).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()


# ── Services ──────────────────────────────────────────────────────────────────

@router.get("/services", response_model=List[schemas.ServiceOut])
def list_services(db: Session = Depends(get_db)):
    """Public: active services."""
    return db.query(models.Service).filter(models.Service.is_active == True).all()


@router.get("/services/all", response_model=List[schemas.ServiceOut])
def list_all_services(
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    return db.query(models.Service).all()


@router.post("/services", response_model=schemas.ServiceOut, status_code=201)
def create_service(
    data: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    s = models.Service(**data.model_dump())
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.put("/services/{sid}", response_model=schemas.ServiceOut)
def update_service(
    sid: int,
    data: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    s = db.query(models.Service).filter(models.Service.id == sid).first()
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")
    for k, v in data.model_dump().items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s


@router.delete("/services/{sid}", status_code=204)
def delete_service(
    sid: int,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    s = db.query(models.Service).filter(models.Service.id == sid).first()
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(s)
    db.commit()


# ── Gallery ───────────────────────────────────────────────────────────────────

@router.get("/gallery", response_model=List[schemas.GalleryItemOut])
def list_gallery(db: Session = Depends(get_db)):
    """Public: published gallery items."""
    return (
        db.query(models.GalleryItem)
        .filter(models.GalleryItem.status == models.GalleryStatus.published)
        .order_by(models.GalleryItem.created_at.desc())
        .all()
    )


@router.get("/gallery/all", response_model=List[schemas.GalleryItemOut])
def list_all_gallery(
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    return db.query(models.GalleryItem).order_by(models.GalleryItem.created_at.desc()).all()


@router.post("/gallery", response_model=schemas.GalleryItemOut, status_code=201)
async def upload_gallery_item(
    title: str = Form(..., max_length=128),
    description: Optional[str] = Form(None, max_length=500),
    category: Optional[str] = Form(None, max_length=64),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    """Admin: upload a gallery image. File is validated and renamed to UUID."""
    # Validate extension using allow-list
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {ALLOWED_EXTENSIONS}")

    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    # Generate UUID filename — never use original filename in storage path
    safe_filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / safe_filename

    with open(file_path, "wb") as f:
        f.write(contents)

    item = models.GalleryItem(
        title=title,
        description=description,
        image_filename=safe_filename,
        category=category,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/gallery/image/{filename}")
def serve_gallery_image(filename: str):
    """
    Serve gallery images. Validates filename to prevent path traversal.
    Filenames are UUIDs so only alphanumeric + hyphen + dot allowed.
    """
    import re
    if not re.match(r'^[a-f0-9\-]+\.(jpg|jpeg|png|webp)$', filename, re.IGNORECASE):
        raise HTTPException(status_code=400, detail="Invalid filename")
    # Resolve and verify it's within the upload directory
    resolved = (UPLOAD_DIR / filename).resolve()
    upload_resolved = UPLOAD_DIR.resolve()
    if not str(resolved).startswith(str(upload_resolved) + os.sep):
        raise HTTPException(status_code=403, detail="Forbidden")
    if not resolved.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(
        path=resolved,
        headers={
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": "inline",
        }
    )


@router.patch("/gallery/{gid}/status", response_model=schemas.GalleryItemOut)
def update_gallery_status(
    gid: int,
    update: schemas.GalleryStatusUpdate,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    item = db.query(models.GalleryItem).filter(models.GalleryItem.id == gid).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    item.status = update.status
    db.commit()
    db.refresh(item)
    return item


@router.delete("/gallery/{gid}", status_code=204)
def delete_gallery_item(
    gid: int,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    item = db.query(models.GalleryItem).filter(models.GalleryItem.id == gid).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    # Delete physical file
    file_path = UPLOAD_DIR / item.image_filename
    if file_path.exists():
        file_path.unlink()
    db.delete(item)
    db.commit()


# ── Settings ──────────────────────────────────────────────────────────────────

@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    """Public: fetch non-sensitive site settings."""
    settings = db.query(models.SiteSetting).all()
    return {s.key: s.value for s in settings}


@router.put("/settings/{key}")
def update_setting(
    key: str,
    update: schemas.SettingUpdate,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == key).first()
    if setting:
        setting.value = update.value
    else:
        setting = models.SiteSetting(key=key, value=update.value)
        db.add(setting)
    db.commit()
    return {"key": key, "value": update.value}
