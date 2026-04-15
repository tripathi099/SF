# Smart Farming Assistant — Crop Recommendation (Full-Stack ML Demo)

A portfolio-oriented full-stack project that recommends crops from soil and weather inputs using a trained ML model served through a Python API and consumed by a React UI.

---

## 1) Project Overview

This project started as notebook-based ML experimentation and was productized into a demo-ready web application:

- **ML training pipeline** in Python (artifact-based, reproducible)
- **FastAPI backend** for inference (`/health`, `/predict`)
- **React + TypeScript + Material UI frontend** for a clean, interactive user flow

The goal is to demonstrate practical product thinking: take research code and turn it into a usable, testable application.

---

## 2) Problem Statement

Farmers and agricultural planners often need quick recommendations about which crop best matches local soil nutrients and weather conditions. This application provides a simple input-to-recommendation workflow for:

- N, P, K soil nutrient levels
- temperature
- humidity
- pH
- rainfall

The model returns:

- a recommended crop,
- confidence score,
- top alternatives.

---

## 3) Why This Project Is Relevant

This project highlights skills frequently requested in product-focused software roles:

- **React + TypeScript UI development** with componentized structure
- **Material UI implementation** for polished, demo-friendly UX
- **Backend API integration** with explicit contracts and error handling
- **ML-to-product workflow** (training script → artifact → API inference)

It is designed to be easy to discuss in interviews as an end-to-end build.

---

## 4) Key Features

- End-to-end crop recommendation workflow
- Local model training script that saves artifacts for runtime use
- FastAPI inference API with typed request/response models
- Frontend form with validation and backend-connected prediction flow
- UI states for loading, success, and error handling
- Top-3 alternatives and model status shown in the UI

---

## 5) Architecture Summary

### High-level flow

`Crop_recommendation.csv`  
→ `backend/ml/train.py` (train model)  
→ `backend/models/crop_recommendation_model.joblib` (saved artifact)  
→ `backend/app/main.py` FastAPI `/predict` (inference)  
→ `frontend` React app (form submission + result rendering)

### Runtime responsibilities

- **Training layer**: fits `DecisionTreeClassifier` and persists artifact/metrics
- **Backend layer**: loads artifact and returns prediction response
- **Frontend layer**: collects input, validates values, calls API, renders results

---

## 6) Tech Stack

### Backend / ML
- Python
- FastAPI
- scikit-learn
- pandas, numpy
- joblib

### Frontend
- React
- TypeScript
- Vite
- Material UI (MUI)

---

## 7) Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── predictor.py
│   │   └── schemas.py
│   ├── ml/
│   │   └── train.py
│   └── models/                # generated artifacts (ignored in git)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.ts
│   │   ├── theme.ts
│   │   └── types.ts
│   └── package.json
├── scripts/
│   └── train_model.py
├── Crop_recommendation.csv
├── SmartFarming.ipynb         # legacy/research notebook
└── README.md
```

---

## 8) Local Setup

> Prerequisites: Python 3.10+ and Node.js 18+

### 8.1 Clone the repository

```bash
git clone <your-repo-url>
cd SF
```

### 8.2 Install Python dependencies

```bash
pip install -r requirements.txt
```

### 8.3 Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## 9) Train the Model Artifact

Run training once (or whenever retraining is desired):

```bash
python scripts/train_model.py
```

Expected outputs:

- `backend/models/crop_recommendation_model.joblib`
- `backend/models/training_metrics.json`

---

## 10) Run the Backend API

```bash
uvicorn backend.app.main:app --reload
```

Default base URL:

- `http://localhost:8000`

---

## 11) Run the Frontend

```bash
cd frontend
npm run dev
```

Default frontend URL (Vite):

- `http://localhost:5173`

---

## 12) Environment Variables

Frontend supports API base URL configuration:

- `VITE_API_BASE_URL` (optional)

Create `frontend/.env` (or `.env.local`) if needed:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

If not set, frontend defaults to `http://localhost:8000`.

---

## 13) API Overview

### `GET /health`

Basic health/model status check.

Example response:

```json
{
  "status": "ok",
  "model_status": "ready"
}
```

### `POST /predict`

Request body:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
```

Response body:

```json
{
  "recommended_crop": "rice",
  "confidence": 0.91,
  "top_3_predictions": [
    { "crop": "rice", "confidence": 0.91 },
    { "crop": "maize", "confidence": 0.06 },
    { "crop": "cotton", "confidence": 0.03 }
  ],
  "model_status": "ready"
}
```

---

## 14) Screenshots / Demo Preview

> Screenshots are not checked into this repo yet.

Recommended placeholders for GitHub portfolio presentation:

- `docs/screenshots/home-shell.png`
- `docs/screenshots/form-validation.png`
- `docs/screenshots/prediction-result.png`

(You can replace these placeholders with actual images from your local run.)

---

## 15) Legacy Notebook Note

`SmartFarming.ipynb` is kept as legacy research/EDA context.

Production runtime does **not** depend on notebook execution. The app uses Python modules and persisted model artifacts.

---

## 16) Future Improvements

- Dockerized one-command local setup
- Frontend unit tests + API integration tests
- Better model calibration and confidence diagnostics
- Input presets and domain-specific helper text for faster demos
- Cloud deployment (frontend + backend)

---

## 17) License

This project is licensed under the MIT License.
