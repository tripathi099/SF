from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
DATASET_PATH = ROOT_DIR / "Crop_recommendation.csv"
MODEL_DIR = ROOT_DIR / "backend" / "models"
MODEL_PATH = MODEL_DIR / "crop_recommendation_model.joblib"
METRICS_PATH = MODEL_DIR / "training_metrics.json"

FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET_COLUMN = "label"
