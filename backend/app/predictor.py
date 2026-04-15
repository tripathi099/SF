from __future__ import annotations

from dataclasses import dataclass

import joblib
import numpy as np

from backend.app.config import FEATURE_COLUMNS, MODEL_PATH
from backend.app.schemas import PredictionItem, PredictionRequest, PredictionResponse


@dataclass
class ModelRuntime:
    model: object | None
    classes: list[str]
    feature_columns: list[str]
    status: str


def load_model_runtime() -> ModelRuntime:
    try:
        artifact = joblib.load(MODEL_PATH)
    except FileNotFoundError:
        return ModelRuntime(model=None, classes=[], feature_columns=FEATURE_COLUMNS, status="missing")
    except Exception:
        return ModelRuntime(model=None, classes=[], feature_columns=FEATURE_COLUMNS, status="error")

    model = artifact.get("model")
    classes = artifact.get("classes") or []
    feature_columns = artifact.get("feature_columns") or FEATURE_COLUMNS

    if model is None:
        return ModelRuntime(model=None, classes=[], feature_columns=feature_columns, status="invalid")

    return ModelRuntime(model=model, classes=list(classes), feature_columns=list(feature_columns), status="ready")


def build_feature_array(payload: PredictionRequest, feature_columns: list[str]) -> np.ndarray:
    row = [getattr(payload, column) for column in feature_columns]
    return np.array([row], dtype=float)


def predict_crop(payload: PredictionRequest, runtime: ModelRuntime) -> PredictionResponse:
    if runtime.model is None:
        raise RuntimeError("Model is not ready for inference.")

    X = build_feature_array(payload, runtime.feature_columns)
    probabilities = runtime.model.predict_proba(X)[0]

    ranked_indices = np.argsort(probabilities)[::-1]
    top_indices = ranked_indices[:3]

    top_predictions = [
        PredictionItem(crop=str(runtime.classes[i]), confidence=float(probabilities[i]))
        for i in top_indices
    ]

    best = top_predictions[0]

    return PredictionResponse(
        recommended_crop=best.crop,
        confidence=best.confidence,
        top_3_predictions=top_predictions,
        model_status=runtime.status,
    )
