"""Uji kontrak API (BACKEND.md) memakai artefak asli di model/."""

import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient

from ev_web import api
from ev_web import model as ev

SAMPLE = pd.read_csv(api.MODEL_DIR / "sample_predictions.csv")  # 1000 baris holdout + P(Yes) dari run Kaggle
ROWS = SAMPLE.drop(columns="p_expected").to_dict("records")


@pytest.fixture(scope="module")
def client():
    with TestClient(api.app) as c:  # `with` -> lifespan jalan, model dimuat sekali
        yield c


def predict(client, features, model_name="ensemble"):
    return client.post("/predict", json={"model_name": model_name, "features": features})


def test_artifact_roundtrip(client):
    np.testing.assert_allclose(ev.predict_proba(api.STATE, SAMPLE), SAMPLE.p_expected, atol=1e-6)


def test_root_and_health(client):
    assert client.get("/").json()["status"] == "running"
    assert client.get("/health").json() == {
        "status": "ok", "models": {"xgboost": "ready", "catboost": "ready", "ensemble": "ready"}}


def test_models_carry_holdout_metrics(client):
    models = {m["name"]: m for m in client.get("/models").json()["models"]}
    assert set(models) == set(api.MODELS) and all(m["available"] for m in models.values())
    assert models["ensemble"]["holdout_metrics"]["threshold"] == api.STATE["threshold"]
    assert models["xgboost"]["holdout_metrics"]["roc_auc"] == api.STATE["holdout"]["XGBoost"]["ROC-AUC"]


def test_features_follow_training_encoding(client):
    feats = {f["name"]: f for f in client.get("/features").json()["features"]}
    assert list(feats) == ev.FEATURES
    for col, cats in {**ev.CATEGORIES, **ev.TO_INT}.items():
        assert feats[col]["type"] == "select" and [o["value"] for o in feats[col]["options"]] == list(cats)
    for col in ev.NUMERIC:  # batas validasi = rentang nilai yang dilihat model (tabel frekuensi train)
        seen = api.STATE["freq"][col].index
        assert (feats[col]["min"], feats[col]["max"]) == (seen.min(), seen.max())


def test_predict_matches_kaggle_run(client):
    for row, expected in zip(ROWS[:50], SAMPLE.p_expected[:50]):
        r = predict(client, row)
        assert r.status_code == 200
        body = r.json()
        assert abs(body["probability"] - expected) < 1e-6
        assert body["prediction"] == int(expected >= api.STATE["threshold"])
        assert body["prediction_label"] == ("Yes" if body["prediction"] else "No")


@pytest.mark.parametrize("name, key", [("xgboost", "xgb"), ("catboost", "cat")])
def test_single_models_match_direct_inference(client, name, key):
    got = [predict(client, row, name).json() for row in ROWS[:20]]
    np.testing.assert_allclose([g["probability"] for g in got], ev.predict_proba(api.STATE, SAMPLE.iloc[:20], key),
                               atol=1e-6)
    assert {g["threshold"] for g in got} == {api.STATE["holdout"][api.MODELS[name][1]]["Threshold"]}


def test_commute_rounded_to_training_resolution(client):
    a = predict(client, {**ROWS[0], "Daily_Commute_km": 19.400000000000002}).json()["probability"]
    assert a == predict(client, {**ROWS[0], "Daily_Commute_km": 19.4}).json()["probability"]


@pytest.mark.parametrize("field, value", [
    ("Age", "tiga puluh"),           # tipe salah
    ("Number_of_Cars_Owned", 0),     # di luar rentang training (Income_per_Car tak terdefinisi)
    ("Age", 80),                     # di luar rentang training
    ("City_Type", "Mars"),           # kategori tidak dikenal
    ("Annual_Income_USD", 50_000.5), # pecahan di kolom bilangan bulat
])
def test_invalid_feature_value(client, field, value):
    r = predict(client, {**ROWS[0], field: value})
    assert r.status_code == 422
    assert r.json()["detail"]["code"] == "INVALID_FEATURES"
    assert [e["field"] for e in r.json()["detail"]["errors"]] == [f"features.{field}"]


def test_missing_and_unknown_feature(client):
    row = {k: v for k, v in ROWS[0].items() if k != "Gender"} | {"Genderr": "Male"}
    r = predict(client, row)
    assert r.status_code == 422
    assert {e["field"] for e in r.json()["detail"]["errors"]} == {"features.Gender", "features.Genderr"}


def test_unknown_model_and_malformed_body(client):
    r = predict(client, ROWS[0], "random_forest")
    assert r.status_code == 404 and r.json()["detail"]["code"] == "MODEL_NOT_FOUND"
    r = client.post("/predict", content="{bukan json", headers={"Content-Type": "application/json"})
    assert r.status_code == 400 and r.json()["detail"]["code"] == "INVALID_REQUEST"


def test_degraded_when_catboost_unavailable(client, monkeypatch):
    monkeypatch.delitem(api.STATE, "cat")
    health = client.get("/health").json()
    assert health["status"] == "degraded" and health["models"]["catboost"] == "unavailable"
    for name in ("catboost", "ensemble"):
        r = predict(client, ROWS[0], name)
        assert r.status_code == 503 and r.json()["detail"]["code"] == "MODEL_UNAVAILABLE"
    assert predict(client, ROWS[0], "xgboost").status_code == 200


def test_inference_error_hides_internals(client, monkeypatch):
    def boom(*_):
        raise RuntimeError("/srv/secret/path")

    monkeypatch.setattr(ev, "predict_proba", boom)
    r = predict(client, ROWS[0])
    assert r.status_code == 500 and r.json()["detail"]["code"] == "PREDICTION_ERROR"
    assert "secret" not in r.text


def test_cors_allows_local_frontend(client):
    r = client.options("/predict", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST",
                                            "Access-Control-Request-Headers": "content-type"})
    assert r.headers["access-control-allow-origin"] == "http://localhost:5173"
    r = client.get("/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in r.headers
