from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "Mental_Health_Score_Prediction_Model.pkl"
STATIC_DIR = BASE_DIR / "static"
model = joblib.load(MODEL_PATH)

app = FastAPI(
    title="Mental Health Score Prediction API",
    description="Predicts a mental-health score from social-media and lifestyle inputs.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    # Supports opening index.html through FastAPI or a local development server.
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class StudentData(BaseModel):
    Age: int = Field(..., ge=10, le=100, description="Age in years")
    Gender: Literal["Male", "Female", "Other"]
    Academic_Level: Literal["High School", "Undergraduate", "Graduate"]
    Country: str = Field(..., min_length=1, description="Country of residence")
    Most_Used_Platform: Literal[
        "Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube",
        "TikTok", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat",
    ]
    Purpose_Of_Use: Literal["Networking", "Education", "Entertainment", "News"]
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24)
    Daily_Unlocks: int = Field(..., ge=0)
    Study_Hours: float = Field(..., ge=0)
    Physical_Activity_Hours: float = Field(..., ge=0)
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24)
    Stress_Level: Literal["Low", "Medium", "High", "Very High"]


class PredictionResponse(BaseModel):
    predicted_mental_health_score: float


TOP_COUNTRIES = {"India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France"}


@app.get("/", include_in_schema=False)
def read_root() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(data: StudentData) -> PredictionResponse:
    """Create the feature table required by the saved scikit-learn pipeline."""
    country = data.Country.strip()
    grouped_country = country if country in TOP_COUNTRIES else "Other"

    input_data = pd.DataFrame([
        {
            "Age": data.Age,
            "Gender": data.Gender,
            "Academic_Level": data.Academic_Level,
            "Most_Used_Platform": data.Most_Used_Platform,
            "Purpose_Of_Use": data.Purpose_Of_Use,
            "Avg_Daily_Usage_Hours": data.Avg_Daily_Usage_Hours,
            "Daily_Unlocks": data.Daily_Unlocks,
            "Study_Hours": data.Study_Hours,
            "Physical_Activity_Hours": data.Physical_Activity_Hours,
            "Sleep_Hours_Per_Night": data.Sleep_Hours_Per_Night,
            "Stress_Level": data.Stress_Level,
            "Grouped_Country": grouped_country,
        }
    ])
    prediction = float(model.predict(input_data)[0])

    return PredictionResponse(predicted_mental_health_score=round(prediction, 2))
