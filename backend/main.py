from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import tasks
from app.routers import history
from app.routers import ai

app = FastAPI()

# Разрешаем запросы с фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение маршрутов
app.include_router(tasks.router, prefix="/tasks")
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}
