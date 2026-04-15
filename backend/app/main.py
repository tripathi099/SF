from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.app.predictor import ModelRuntime, load_model_runtime, predict_crop
from backend.app.schemas import HealthResponse, PredictionRequest, PredictionResponse

app = FastAPI(title="Crop Recommendation API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sf-six-puce.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

runtime: ModelRuntime = load_model_runtime()


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model_status=runtime.status)


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    if runtime.model is None:
        raise HTTPException(status_code=503, detail="Model artifact is not available.")

    try:
        return predict_crop(payload, runtime)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
