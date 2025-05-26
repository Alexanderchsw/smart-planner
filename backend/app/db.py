from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  # пример: postgresql+psycopg://user:password@localhost/db_name

# Синхронный движок
engine = create_engine(DATABASE_URL, echo=True)

# Сессия
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс моделей
Base = declarative_base()

# Зависимость FastAPI для получения сессии
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
