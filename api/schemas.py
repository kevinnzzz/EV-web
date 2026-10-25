from typing import Any, List, Literal, Optional, Union
from pydantic import BaseModel, Field, field_validator


class InputData(BaseModel):
    Age: int = Field(ge=25, le=69, title="Usia", description="Tahun")
    Annual_Income_USD: float = Field(ge=30000, le=188549, title="Pendapatan tahunan (USD)")
    Daily_Commute_km: float = Field(ge=5, le=98.7, title="Jarak komuter harian (km)")
    Number_of_Cars_Owned: int = Field(ge=1, le=4, title="Jumlah mobil dimiliki")
    Charging_Stations_Near_Home: int = Field(ge=0, le=14, title="Stasiun charging dekat rumah")
    Charging_Stations_Near_Work: int = Field(ge=0, le=19, title="Stasiun charging dekat tempat kerja")
    Environmental_Concern_Level: int = Field(
        ge=1, le=5, title="Kepedulian lingkungan", description="Skala 1 (rendah) sampai 5 (tinggi)"
    )
    Gender: Literal["Female", "Male", "Other"] = Field(title="Gender")
    City_Type: Literal["Rural", "Suburban", "Urban"] = Field(title="Tipe wilayah tempat tinggal")
    Current_Car_Type: Literal["Hatchback", "SUV", "Sedan", "Truck"] = Field(title="Tipe mobil saat ini")
    Home_Charging_Possible: Union[Literal["No", "Yes"], int] = Field(title="Bisa pasang charger di rumah")
    Subsidy_Available: Union[Literal["No", "Yes"], int] = Field(title="Subsidi tersedia")
    Range_Anxiety_Level: Union[Literal["Low", "Medium", "High"], int] = Field(
        title="Tingkat kecemasan jarak tempuh"
    )

    @field_validator("Home_Charging_Possible", "Subsidy_Available", mode="before")
    @classmethod
    def normalize_binary(cls, v: Any) -> str:
        if v in (1, "1", "Yes", "yes", True):
            return "Yes"
        if v in (0, "0", "No", "no", False):
            return "No"
        return str(v)

    @field_validator("Range_Anxiety_Level", mode="before")
    @classmethod
    def normalize_anxiety(cls, v: Any) -> str:
        mapping = {
            0: "Low", "0": "Low", 1: "Low", "1": "Low", "low": "Low", "Low": "Low",
            2: "Medium", "2": "Medium", "medium": "Medium", "Medium": "Medium",
            3: "High", "3": "High", "high": "High", "High": "High"
        }
        return mapping.get(v, str(v))

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictRequest(BaseModel):
    model_name: Optional[str] = Field("ensemble", description="xgboost | catboost | ensemble")
    features: Optional[InputData] = None


class BatchIn(BaseModel):
    items: List[InputData] = Field(min_length=1, max_length=1000)
    model_name: Optional[str] = Field("ensemble", description="xgboost | catboost | ensemble")


class PredictionOut(BaseModel):
    model_name: str = Field("ensemble", description="Nama model yang digunakan")
    probability: float = Field(description="Probabilitas Will_Buy_EV = Yes")
    prediction: int = Field(description="1 jika probability >= threshold, 0 jika tidak")
    prediction_label: str = Field(description="'Yes' atau 'No'")
    threshold: float = Field(description="Ambang batas klasifikasi F1-optimal")