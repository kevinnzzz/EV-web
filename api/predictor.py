import numpy as np
import pandas as pd
from ev_web import model as ev

from .config import MODEL_DIR


class Predictor:
    """Predictor wrapper yang menyajikan single best seed per model (cat.cbm & xgb.ubj),
    menggunakan pipeline feature engineering dan prior correction resmi dari ev_web.model."""

    def __init__(self):
        self.state = ev.load(MODEL_DIR)
        self.threshold = float(self.state.get("threshold", 0.5))
        self.w_xgb = float(self.state.get("weight_xgb", 0.5))
        self.holdout = self.state.get("holdout", {})
        self.versions = self.state.get("versions", {})
        self.features = self.state.get("features", {})

    def get_threshold(self, model_name: str = "ensemble") -> float:
        display = {
            "xgboost": "XGBoost",
            "xgb": "XGBoost",
            "catboost": "CatBoost",
            "cat": "CatBoost",
            "ensemble": "Ensemble",
        }.get(model_name.lower(), "Ensemble")
        return float(self.holdout.get(display, {}).get("Threshold", self.threshold))

    def predict_proba(self, raw: pd.DataFrame, model_name: str = "ensemble") -> np.ndarray:
        model_key = {
            "xgboost": "xgb",
            "xgb": "xgb",
            "catboost": "cat",
            "cat": "cat",
            "ensemble": "ensemble",
        }.get(model_name.lower(), "ensemble")

        return ev.predict_proba(self.state, raw, model=model_key)

    def predict(self, raw: pd.DataFrame, model_name: str = "ensemble"):
        probs = self.predict_proba(raw, model_name=model_name)
        threshold = self.get_threshold(model_name)
        labels = (probs >= threshold).astype(int)
        return probs, labels, threshold