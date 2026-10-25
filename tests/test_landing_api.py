import pytest
from fastapi.testclient import TestClient

from api.main import app

SAMPLE_PAYLOAD = {
    "Age": 35,
    "Annual_Income_USD": 80000,
    "Daily_Commute_km": 25.0,
    "Number_of_Cars_Owned": 1,
    "Charging_Stations_Near_Home": 5,
    "Charging_Stations_Near_Work": 5,
    "Environmental_Concern_Level": 3,
    "Gender": "Male",
    "City_Type": "Urban",
    "Current_Car_Type": "Sedan",
    "Home_Charging_Possible": "Yes",
    "Subsidy_Available": "Yes",
    "Range_Anxiety_Level": "Medium",
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_landing_api_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_landing_api_predict_wrapped(client):
    for m in ["xgboost", "catboost", "ensemble"]:
        r = client.post("/predict", json={"model_name": m, "features": SAMPLE_PAYLOAD})
        assert r.status_code == 200
        body = r.json()
        assert body["model_name"] == m
        assert "probability" in body
        assert "prediction" in body
        assert body["prediction_label"] in ("Yes", "No")
        assert "threshold" in body


def test_landing_api_predict_raw_features(client):
    r = client.post("/predict", json=SAMPLE_PAYLOAD)
    assert r.status_code == 200
    body = r.json()
    assert body["model_name"] == "ensemble"
    assert "probability" in body
    assert body["prediction_label"] in ("Yes", "No")
