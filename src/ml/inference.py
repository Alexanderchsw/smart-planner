# ml/inference.py

"""
Псевдо-модуль инференса.
В реальности сейчас падает на попытке загрузки model.pkl
"""

import joblib

try:
    model = joblib.load('model.pkl')
except Exception as e:
    model = None
    print("Failed to load model:", e)

def predict_duration(features: dict) -> float:
    """
    :param features: {'feature1': val1, 'feature2': val2}
    :return: предсказанная длительность
    """
    if model is None:
        raise RuntimeError("Model unavailable")
    return float(model.predict([ [features['feature1'], features['feature2']] ])[0])
