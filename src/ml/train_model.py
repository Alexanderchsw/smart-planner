# ml/train_model.py

"""
Псевдо-скрипт обучения модели оценок длительности.
(на самом деле сейчас не запускается из-за ошибок с данными)
"""

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

def load_data():
    # предполагаемый файл истории
    return pd.read_csv('../data/task_history.csv')

def train():
    try:
        df = load_data()
        # здесь бы формировались фичи и целевая переменная
        X = df[['feature1', 'feature2']]  
        y = df['real_duration']
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        joblib.dump(model, 'model.pkl')
        print("Model trained and saved.")
    except Exception as e:
        # вот тут и происходит «неполадка»
        print("Error during training:", e)

if __name__ == "__main__":
    train()
