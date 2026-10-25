from contextlib import asynccontextmanager
from typing import Any, Dict

import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from .config import ALLOWED_ORIGINS
from .predictor import Predictor
from .schemas import BatchIn, InputData, PredictionOut

state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Model dimuat sekali saat server menyala
    state["predictor"] = Predictor()
    yield
    state.clear()


app = FastAPI(title="EV Prediction API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "EV Prediction API"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": {
            "xgboost": "ready",
            "catboost": "ready",
            "ensemble": "ready",
        },
    }


@app.get("/info")
def info():
    p: Predictor = state.get("predictor")
    if not p:
        raise HTTPException(status_code=503, detail="Model belum dimuat")
    return {
        "threshold": p.threshold,
        "weight_xgb": p.w_xgb,
        "models": ["xgboost", "catboost", "ensemble"],
        "holdout": p.holdout,
        "trained_with": p.versions,
    }


@app.get("/models")
def list_models():
    p: Predictor = state.get("predictor")
    if not p:
        raise HTTPException(status_code=503, detail="Model belum dimuat")
    return {
        "models": [
            {
                "name": "ensemble",
                "display_name": "Ensemble",
                "threshold": p.get_threshold("ensemble"),
            },
            {
                "name": "xgboost",
                "display_name": "XGBoost",
                "threshold": p.get_threshold("xgboost"),
            },
            {
                "name": "catboost",
                "display_name": "CatBoost",
                "threshold": p.get_threshold("catboost"),
            },
        ]
    }


def _build_prediction(model_name: str, prob: float, label: int, threshold: float) -> PredictionOut:
    return PredictionOut(
        model_name=model_name,
        probability=float(prob),
        prediction=int(label),
        prediction_label="Yes" if label == 1 else "No",
        threshold=float(threshold),
    )


@app.post("/predict", response_model=PredictionOut)
async def predict(request: Request):
    p: Predictor = state.get("predictor")
    if not p:
        raise HTTPException(status_code=503, detail="Model belum siap")

    try:
        body: Dict[str, Any] = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    # Mendukung format: {"model_name": "xgboost", "features": {...}}
    # maupun format langsung: {Age: 35, ...}
    if "features" in body and isinstance(body["features"], dict):
        model_name = str(body.get("model_name", "ensemble"))
        raw_features = body["features"]
    else:
        model_name = str(body.get("model_name", "ensemble"))
        raw_features = {k: v for k, v in body.items() if k != "model_name"}

    try:
        validated = InputData(**raw_features)
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())

    try:
        df = pd.DataFrame([validated.model_dump()])
        probs, labels, threshold = p.predict(df, model_name=model_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memprediksi: {e}")

    return _build_prediction(model_name, probs[0], labels[0], threshold)


@app.post("/predict/batch", response_model=list[PredictionOut])
def predict_batch(batch: BatchIn):
    p: Predictor = state.get("predictor")
    if not p:
        raise HTTPException(status_code=503, detail="Model belum siap")

    model_name = batch.model_name or "ensemble"
    try:
        df = pd.DataFrame([item.model_dump() for item in batch.items])
        probs, labels, threshold = p.predict(df, model_name=model_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memprediksi: {e}")

    return [
        _build_prediction(model_name, prob, label, threshold)
        for prob, label in zip(probs, labels)
    ]