from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from .db import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending")

    priority = Column(String, default="средний")  # высокий / средний / низкий
    duration = Column(Integer, nullable=True)     # длительность в минутах
    deadline = Column(DateTime, nullable=True)
    flexible = Column(Boolean, default=False)     # гибкий диапазон времени
    repeat = Column(String, default="однократно") # повторяемость

    energy_level = Column(String, nullable=True)  # низкий / средний / высокий
    location = Column(String, nullable=True)
    buffer_after = Column(Integer, default=0)     # буфер после задачи в минутах

    created_by_ai = Column(Boolean, default=False)     # ← добавили
    ai_estimate = Column(Integer, default=0)           # ← добавили
    ai_confidence = Column(Integer, default=0)         # ← добавили

    completed_at = Column(DateTime, nullable=True)


    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    task_title = Column(String, nullable=False)
    actual_duration = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
