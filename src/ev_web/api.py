"""FastAPI prediksi Will_Buy_EV — kontrak endpoint & error: BACKEND.md.

Input = 13 kolom asli dataset; preprocessing + FE lewat ev_web.model, identik dengan training.
Jalankan lokal: `uv run uvicorn ev_web.api:app --reload` -> http://127.0.0.1:8000/docs
"""

import logging
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, Literal

import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import AfterValidator, BaseModel, ConfigDict, Field

from ev_web import model as ev

MODEL_DIR = Path(os.environ.get("MODEL_DIR", Path(__file__).resolve().parents[2] / "model"))
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
                .split(",") if o.strip()]
# id di API -> (kunci ev.predict_proba, kunci ensemble.json["holdout"] = nama tampilan)
MODELS = {"xgboost": ("xgb", "XGBoost"), "catboost": ("cat", "CatBoost"), "ensemble": ("ensemble", "Ensemble")}

log = logging.getLogger("uvicorn.error")
STATE: dict = {}  # isi ensemble.json + model yang berhasil dimuat. Read-only setelah startup.


class Customer(BaseModel):
    """13 kolom asli dataset. Batas numerik = rentang data training: di luar itu model tidak pernah belajar."""

    model_config = ConfigDict(extra="forbid")

    Age: int = Field(ge=25, le=69, title="Usia", description="Tahun")
    Annual_Income_USD: int = Field(ge=30_000, le=188_549, title="Pendapatan tahunan", description="USD per tahun")
    Daily_Commute_km: Annotated[float, AfterValidator(lambda v: round(v, 1))] = Field(
        ge=5, le=98.7, title="Jarak komuter harian", description="Km per hari, dibulatkan ke 0,1 km seperti data training")
    Number_of_Cars_Owned: int = Field(ge=1, le=4, title="Jumlah mobil dimiliki")
    Charging_Stations_Near_Home: int = Field(ge=0, le=14, title="Stasiun charging dekat rumah")
    Charging_Stations_Near_Work: int = Field(ge=0, le=19, title="Stasiun charging dekat tempat kerja")
    Environmental_Concern_Level: int = Field(ge=1, le=5, title="Kepedulian lingkungan",
                                             description="Skala 1 (rendah) sampai 5 (tinggi)")
    # pilihan kategori diambil dari encoding training -> API tidak bisa menerima nilai yang tidak dikenal model
    Gender: Literal[*ev.CATEGORIES["Gender"]] = Field(title="Gender")
    City_Type: Literal[*ev.CATEGORIES["City_Type"]] = Field(title="Tipe wilayah tempat tinggal")
    Current_Car_Type: Literal[*ev.CATEGORIES["Current_Car_Type"]] = Field(title="Tipe mobil saat ini")
    Home_Charging_Possible: Literal[*ev.TO_INT["Home_Charging_Possible"]] = Field(title="Bisa charging di rumah")
    Subsidy_Available: Literal[*ev.TO_INT["Subsidy_Available"]] = Field(title="Subsidi EV tersedia")
    Range_Anxiety_Level: Literal[*ev.TO_INT["Range_Anxiety_Level"]] = Field(title="Kecemasan jarak tempuh")


class PredictRequest(BaseModel):
    model_name: str = Field("ensemble", description="xgboost | catboost | ensemble")
    features: Customer


class Prediction(BaseModel):
    model_name: str
    prediction: Literal[0, 1]
    prediction_label: Literal["No", "Yes"]
    probability: float = Field(description="P(Will_Buy_EV = Yes), terkalibrasi (prior correction)")
    threshold: float = Field(description="Ambang F1-optimal dari OOF; prediction = 1 jika probability >= threshold")


FEATURES = [  # skema form frontend, diturunkan dari validasi di atas -> keduanya tidak bisa beda
    {"name": name, "label": p["title"], "type": "select" if "enum" in p else p["type"], "required": True,
     "description": p.get("description"), "min": p.get("minimum"), "max": p.get("maximum"),
     "options": [{"label": v, "value": v} for v in p["enum"]] if "enum" in p else None}
    for name, p in Customer.model_json_schema()["properties"].items()
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    STATE.update(ev.load_meta(MODEL_DIR))  # tanpa ensemble.json tidak ada yang bisa dilayani -> startup gagal
    for key in ("xgb", "cat"):  # gagal satu algoritma -> API tetap jalan, status degraded
        t = time.perf_counter()
        try:
            STATE[key] = ev.load_seeds(MODEL_DIR, key, STATE["n_seeds"])
        except Exception:
            log.exception("Gagal memuat model %s; API berjalan degraded", key)
            continue
        log.info("Model %s: %d seed dimuat (%.1f s)", key, STATE["n_seeds"], time.perf_counter() - t)
    for b in STATE.get("xgb", []):
        b.set_param({"nthread": 1})  # 1 baris per request: thread pool XGBoost justru ~2x lebih lambat
    yield
    STATE.clear()


app = FastAPI(title="EV Purchase Prediction API", version="1.0.0", lifespan=lifespan,
              description="Prediksi minat membeli kendaraan listrik (Will_Buy_EV) — ensemble XGBoost + CatBoost.")
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_methods=["GET", "POST"],
                   allow_headers=["Content-Type"])


def fail(status: int, code: str, message: str) -> HTTPException:
    return HTTPException(status, {"code": code, "message": message})


def ready(key: str) -> bool:
    return all(k in STATE for k in (("xgb", "cat") if key == "ensemble" else (key,)))


@app.exception_handler(RequestValidationError)
async def invalid_request(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Error di dalam `features` -> 422 INVALID_FEATURES; selain itu (JSON rusak, body salah bentuk) -> 400."""
    errors = exc.errors()
    if all(e["loc"][:2] == ("body", "features") for e in errors):
        status, code, message = 422, "INVALID_FEATURES", "Periksa kembali input yang diberikan."
    else:
        status, code, message = 400, "INVALID_REQUEST", "Request tidak sesuai kontrak API."
    fields = [{"field": ".".join(map(str, e["loc"][1:])), "message": e["msg"]} for e in errors]
    return JSONResponse({"detail": {"code": code, "message": message, "errors": fields}}, status_code=status)


@app.get("/")
def root():
    return {"name": app.title, "version": app.version, "status": "running"}


@app.get("/health")
def health():
    models = {name: "ready" if ready(key) else "unavailable" for name, (key, _) in MODELS.items()}
    return {"status": "degraded" if "unavailable" in models.values() else "ok", "models": models}


@app.get("/models")
def list_models():
    return {
        "models": [{"name": name, "display_name": display, "available": ready(key),
                    "holdout_metrics": {k.lower().replace("-", "_"): v for k, v in STATE["holdout"][display].items()}}
                   for name, (key, display) in MODELS.items()],
        "artifact": {k: STATE[k] for k in ("commit", "created_at", "trained_on")},
    }


@app.get("/features")
def features():
    return {"features": FEATURES}


@app.post("/predict")
def predict(req: PredictRequest) -> Prediction:
    if req.model_name not in MODELS:
        raise fail(404, "MODEL_NOT_FOUND", f"Model '{req.model_name}' tidak dikenal. Pilihan: {', '.join(MODELS)}.")
    key, display = MODELS[req.model_name]
    if not ready(key):
        raise fail(503, "MODEL_UNAVAILABLE", f"Model {display} sedang tidak tersedia.")
    try:
        p = float(ev.predict_proba(STATE, pd.DataFrame([req.features.model_dump()]), key)[0])
    except Exception:
        log.exception("Inference %s gagal", display)
        raise fail(500, "PREDICTION_ERROR", "Terjadi kesalahan saat menjalankan prediksi.") from None
    threshold = STATE["holdout"][display]["Threshold"]
    y = int(p >= threshold)
    return Prediction(model_name=req.model_name, prediction=y, prediction_label="Yes" if y else "No",
                      probability=p, threshold=threshold)
