from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import History
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(tags=["History"])

class HistoryCreate(BaseModel):
    task_title: str
    actual_duration: int

class HistoryRead(HistoryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[HistoryRead])
def get_history(db: Session = Depends(get_db)):
    return db.query(History).all()

@router.post("/", response_model=HistoryRead)
def create_history(entry: HistoryCreate, db: Session = Depends(get_db)):
    new_entry = History(**entry.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
