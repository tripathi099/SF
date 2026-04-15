from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    N: float = Field(..., description="Nitrogen content in soil")
    P: float = Field(..., description="Phosphorus content in soil")
    K: float = Field(..., description="Potassium content in soil")
    temperature: float
    humidity: float
    ph: float
    rainfall: float


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
