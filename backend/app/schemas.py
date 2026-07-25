from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    N: float = Field(..., ge=0, le=150, description="Nitrogen content in soil")
    P: float = Field(..., ge=0, le=150, description="Phosphorus content in soil")
    K: float = Field(..., ge=0, le=220, description="Potassium content in soil")
    temperature: float = Field(..., ge=0, le=50, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, le=400, description="Rainfall in millimetres")


class PredictionItem(BaseModel):
    crop: str
    confidence: float


class PredictionResponse(BaseModel):
    recommended_crop: str
    confidence: float
    top_3_predictions: list[PredictionItem]
    model_status: str


class HealthResponse(BaseModel):
    status: str
    model_status: str
