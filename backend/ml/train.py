from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from backend.app.config import (
    DATASET_PATH,
    FEATURE_COLUMNS,
    METRICS_PATH,
    MODEL_PATH,
    TARGET_COLUMN,
)


@dataclass
class TrainingMetrics:
    accuracy: float
    model_name: str
    train_size: int
    test_size: int


def load_dataset(dataset_path: Path) -> pd.DataFrame:
    dataset = pd.read_csv(dataset_path)
    required_columns = set(FEATURE_COLUMNS + [TARGET_COLUMN])
    missing_columns = sorted(required_columns - set(dataset.columns))
    if missing_columns:
        missing = ", ".join(missing_columns)
        raise ValueError(f"Dataset is missing required columns: {missing}")
    return dataset


def train_model(
    dataset_path: Path,
    random_state: int = 42,
    test_size: float = 0.2,
) -> tuple[DecisionTreeClassifier, TrainingMetrics, dict[str, Any]]:
    dataset = load_dataset(dataset_path)

    X = dataset[FEATURE_COLUMNS]
    y = dataset[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    model = DecisionTreeClassifier(
        criterion="entropy",
        splitter="best",
        max_features=len(FEATURE_COLUMNS),
        max_depth=6,
        random_state=random_state,
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    report = classification_report(y_test, predictions, output_dict=True)

    metrics = TrainingMetrics(
        accuracy=accuracy,
        model_name="DecisionTreeClassifier",
        train_size=len(X_train),
        test_size=len(X_test),
    )
    return model, metrics, report


def save_artifacts(
    model: DecisionTreeClassifier,
    metrics: TrainingMetrics,
    report: dict[str, Any],
    model_path: Path,
    metrics_path: Path,
) -> None:
    model_path.parent.mkdir(parents=True, exist_ok=True)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)

    artifact = {
        "model": model,
        "feature_columns": FEATURE_COLUMNS,
        "target_column": TARGET_COLUMN,
        "classes": list(model.classes_),
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
    }

    joblib.dump(artifact, model_path)

    metrics_path.write_text(
        json.dumps(
            {
                "summary": asdict(metrics),
                "classification_report": report,
            },
            indent=2,
        )
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train crop recommendation model and save artifacts.")
    parser.add_argument("--dataset-path", type=Path, default=DATASET_PATH)
    parser.add_argument("--model-path", type=Path, default=MODEL_PATH)
    parser.add_argument("--metrics-path", type=Path, default=METRICS_PATH)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument("--test-size", type=float, default=0.2)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    model, metrics, report = train_model(
        dataset_path=args.dataset_path,
        random_state=args.random_state,
        test_size=args.test_size,
    )
    save_artifacts(
        model=model,
        metrics=metrics,
        report=report,
        model_path=args.model_path,
        metrics_path=args.metrics_path,
    )

    print(f"Model trained: {metrics.model_name}")
    print(f"Accuracy: {metrics.accuracy:.4f}")
    print(f"Saved model artifact to: {args.model_path}")
    print(f"Saved metrics to: {args.metrics_path}")


if __name__ == "__main__":
    main()
