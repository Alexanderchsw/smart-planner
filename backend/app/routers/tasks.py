from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND

from app.db import get_db
from app.models import Task
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(tags=["Tasks"])

# ======== Pydantic Schemas =========

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"

    duration: Optional[int] = 0
    deadline: Optional[datetime] = None
    flexible: Optional[bool] = False
    repeat: Optional[str] = "single"  # ✅ сменить "однократно" на "single"
    priority: Optional[str] = "med"   # ✅ сменить "средний" на "med"
    energy_level: Optional[str] = None
    location: Optional[str] = None
    buffer_after: Optional[int] = 0

    created_by_ai: Optional[bool] = False
    ai_estimate: Optional[int] = 0
    ai_confidence: Optional[float] = 0.0


class TaskRead(TaskCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None  # добавлено

    class Config:
        from_attributes = True

# ======== CRUD Routes ==========

@router.get("/", response_model=List[TaskRead])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.post("/", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, updated: TaskCreate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")

    was_completed = task.status != "completed" and updated.status == "completed"
    completed_at = datetime.utcnow() if was_completed else task.completed_at

    for key, value in updated.dict().items():
        setattr(task, key, value)
    task.completed_at = completed_at
    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    if was_completed:
        from app.models import History
        from sqlalchemy.exc import SQLAlchemyError
        try:
            actual_duration = (task.completed_at - task.created_at).total_seconds() // 60
            new_history = History(task_title=task.title, actual_duration=int(actual_duration))
            db.add(new_history)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            print("Ошибка при записи в историю:", e)

    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
