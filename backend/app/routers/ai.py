# backend/app/routers/ai.py

from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import History

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import numpy as np

router = APIRouter(tags=["AI"])

@router.get("/predict-duration")
def predict_duration(title: str = Query(...), db: Session = Depends(get_db)):
    history = db.query(History).all()

    if not history or len(history) < 2:
        raise HTTPException(status_code=400, detail="Недостаточно данных для обучения")

    X = np.array([[len(h.task_title)] for h in history])
    y = np.array([h.actual_duration for h in history])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor()
    model.fit(X_train, y_train)

    confidence = r2_score(y_test, model.predict(X_test))
    prediction = model.predict([[len(title)]])[0]

    return {
        "predicted_duration": round(prediction),
        "confidence": round(confidence, 2),
        "used_entries_count": len(history)
    }
