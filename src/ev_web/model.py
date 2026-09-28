"""Preprocessing, feature engineering, dan inferensi ensemble XGBoost x CatBoost — dipakai notebook dan FastAPI."""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from xgboost import XGBClassifier

TARGET = "Will_Buy_EV"
NUMERIC = [
    "Age", "Annual_Income_USD", "Daily_Commute_km", "Number_of_Cars_Owned",
    "Charging_Stations_Near_Home", "Charging_Stations_Near_Work", "Environmental_Concern_Level",
]
# Kategori tetap: encoding 1 baris dari API identik dengan encoding saat training.
CATEGORIES = {
    "Gender": ["Female", "Male", "Other"],
    "City_Type": ["Rural", "Suburban", "Urban"],
    "Current_Car_Type": ["Hatchback", "SUV", "Sedan", "Truck"],
}
TO_INT = {
    "Home_Charging_Possible": {"No": 0, "Yes": 1},
    "Subsidy_Available": {"No": 0, "Yes": 1},
    "Range_Anxiety_Level": {"Low": 0, "Medium": 1, "High": 2},
}
FEATURES = NUMERIC + list(CATEGORIES) + list(TO_INT)  # 13 kolom input = kolom dataset asli
NUM_AS_CAT = ["Age", "Daily_Commute_km", "Number_of_Cars_Owned", "Charging_Stations_Near_Home",
              "Charging_Stations_Near_Work", "Environmental_Concern_Level"]
FE_GROUPS = {  # kandidat fitur turunan, semuanya dihitung dari 13 kolom input
    "domain": ["Total_Charging_Stations", "Income_per_Car", "Concern_x_Subsidy", "Income_x_Concern",
               "Anxiety_x_Commute", "Commute_per_Station", "Charging_Access"],
    "clip": ["Income_Clipped", "Commute_Clipped"],
    "freq": [f"{c}_freq" for c in NUMERIC],
    "num_cat": [f"{c}_cat" for c in NUM_AS_CAT],
}


def freq_maps(df: pd.DataFrame) -> dict:
    """Frekuensi tiap nilai numerik — dihitung dari data train saja, tanpa target."""
    return {c: df[c].astype(float).value_counts() for c in NUMERIC}


def prepare(df: pd.DataFrame, freq: dict) -> pd.DataFrame:
    """13 kolom mentah (CSV / payload API) -> semua fitur kandidat; tiap model memakai subsetnya sendiri."""
    X = df[FEATURES].copy()
    for col, mapping in TO_INT.items():
        X[col] = X[col].map(mapping)
    for col, cats in CATEGORIES.items():
        X[col] = pd.Categorical(X[col], categories=cats)
    bad = X.columns[X.isna().any()].tolist()
    if bad:
        raise ValueError(f"Nilai kosong/tidak dikenal di kolom: {bad}")

    stations = X["Charging_Stations_Near_Home"] + X["Charging_Stations_Near_Work"]
    X["Total_Charging_Stations"] = stations
    X["Income_per_Car"] = X["Annual_Income_USD"] / X["Number_of_Cars_Owned"]
    X["Concern_x_Subsidy"] = X["Environmental_Concern_Level"] * X["Subsidy_Available"]
    X["Income_x_Concern"] = X["Annual_Income_USD"] * X["Environmental_Concern_Level"]
    X["Anxiety_x_Commute"] = (X["Range_Anxiety_Level"] + 1) * X["Daily_Commute_km"]
    X["Commute_per_Station"] = X["Daily_Commute_km"] / (stations + 1)
    X["Charging_Access"] = (X["Home_Charging_Possible"] + (X["Charging_Stations_Near_Home"] > 0)
                            + (X["Charging_Stations_Near_Work"] > 0))
    X["Income_Clipped"] = (X["Annual_Income_USD"] <= 30_000).astype(int)
    X["Commute_Clipped"] = (X["Daily_Commute_km"] <= 5).astype(int)
    for col, counts in freq.items():  # nilai yang tidak pernah muncul di train -> 0
        X[f"{col}_freq"] = X[col].astype(float).map(counts).fillna(0)
    for col in NUM_AS_CAT:  # string -> cat_feature CatBoost; nilai baru = kategori baru
        X[f"{col}_cat"] = X[col].astype(float).astype(str).astype(object)
    return X


def prior_correct(p: np.ndarray, s: float) -> np.ndarray:
    """Model dengan bobot kelas positif s memprediksi odds s kali lipat -> kembalikan ke probabilitas asli."""
    return p / (p + s * (1 - p))


def load(model_dir) -> dict:
    """Muat artefak notebook -> {'xgb': [model per seed], 'cat': [...], + isi ensemble.json}."""
    model_dir = Path(model_dir)
    meta = json.loads((model_dir / "ensemble.json").read_text())
    meta["freq"] = {c: pd.Series({float(k): n for k, n in m.items()}) for c, m in meta["freq"].items()}
    xgb = []
    for i in range(meta["n_seeds"]):
        m = XGBClassifier()
        m.load_model(model_dir / f"xgb_{i}.ubj")
        m.set_params(device="cpu")  # model hasil training GPU tetap jalan di server CPU
        xgb.append(m)
    cat = [CatBoostClassifier().load_model(str(model_dir / f"cat_{i}.cbm")) for i in range(meta["n_seeds"])]
    return {**meta, "xgb": xgb, "cat": cat}


def predict_proba(models: dict, df: pd.DataFrame) -> np.ndarray:
    """P(Will_Buy_EV = Yes): rata-rata antar-seed -> prior correction -> weighted soft voting."""
    X = prepare(df, models["freq"])
    p = {name: prior_correct(np.mean([m.predict_proba(X[models["features"][name]])[:, 1] for m in models[name]],
                                     axis=0), models["prior_scale"][name])
         for name in ("xgb", "cat")}
    return models["weight_xgb"] * p["xgb"] + (1 - models["weight_xgb"]) * p["cat"]
