from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth import get_current_admin
import models
import schemas

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.post("/", response_model=schemas.MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    """Public contact form submission."""
    db_message = models.Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/", response_model=List[schemas.MessageOut])
def list_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    return db.query(models.Message).order_by(models.Message.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{message_id}", response_model=schemas.MessageOut)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    msg = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    # Mark as read
    if msg.status == models.MessageStatus.unread:
        msg.status = models.MessageStatus.read
        db.commit()
        db.refresh(msg)
    return msg


@router.patch("/{message_id}/reply", response_model=schemas.MessageOut)
def reply_to_message(
    message_id: int,
    reply_data: schemas.MessageReply,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    msg = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.reply = reply_data.reply
    msg.status = models.MessageStatus.replied
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    _: models.Admin = Depends(get_current_admin),
):
    msg = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
