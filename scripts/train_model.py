"""Train and persist model artifacts for the backend API.

Usage:
    python scripts/train_model.py
"""

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.ml.train import main


if __name__ == "__main__":
    main()
