# Smart Farming Assistant

An end-to-end full-stack ML application that turns soil and weather inputs into actionable crop recommendations through a production-style web product.

## Live Demo

- Frontend (Vercel): https://sf-six-puce.vercel.app
- Backend (Render): https://sf-tydj.onrender.com

How to use:
1. Open the frontend URL.
2. Enter all 7 required soil/weather inputs.
3. Submit to get the recommended crop, confidence score, top-3 alternatives, and model status.

## Problem Statement

Crop selection is a high-impact decision influenced by soil nutrients and local weather patterns. In many settings, growers need a fast, data-informed starting point rather than manual trial-and-error.

This project solves that by exposing an ML-powered recommendation workflow in a simple web application, making model inference accessible through a user-friendly interface.

## Key Features

- Real-time ML prediction through a FastAPI inference endpoint.
- Typed frontend-backend integration using TypeScript and structured API contracts.
- Input validation, loading states, and error handling for reliable UX.
- Top-3 prediction alternatives with confidence values for decision support.
- Model status feedback surfaced from backend health/runtime state.

## Architecture Overview

Pipeline flow:

`Dataset` → `Training Script` → `Model Artifact` → `FastAPI Inference API` → `React Frontend`

- The crop dataset (`Crop_recommendation.csv`) is used to train a Decision Tree model.
- Training outputs a persisted artifact (`.joblib`) consumed by the backend at runtime.
- The backend exposes `/health` and `/predict` endpoints.
- The frontend collects inputs, calls the API, and renders prediction results and alternatives.

This project demonstrates the transition from notebook experimentation to a deployable product architecture.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI

### Backend
- FastAPI
- Pydantic
- Uvicorn

### Machine Learning
- scikit-learn (Decision Tree)
- pandas
- numpy
- joblib

### Deployment
- Vercel (frontend)
- Render (backend)

## Project Structure

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
│   └── models/                    # generated artifacts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.ts
│   │   ├── theme.ts
│   │   └── types.ts
│   ├── index.html
│   └── package.json
├── scripts/
│   └── train_model.py
├── Crop_recommendation.csv
├── SmartFarming.ipynb             # original notebook workflow
├── requirements.txt
└── README.md
```

## API Documentation

### `GET /health`

Checks API availability and model runtime status.

Example response:

```json
{
  "status": "ok",
  "model_status": "ready"
}
```

### `POST /predict`

Returns crop recommendation, confidence, top-3 alternatives, and model status.

Example request:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.93
}
```

Example response:

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

## Local Setup Instructions

Prerequisites:
- Python 3.10+
- Node.js 18+

1. Install dependencies

```bash
pip install -r requirements.txt
cd frontend && npm install && cd ..
```

2. Train the model artifact

```bash
python scripts/train_model.py
```

3. Run the backend

```bash
uvicorn backend.app.main:app --reload
```

4. Run the frontend

```bash
cd frontend
npm run dev
```

Optional frontend environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Deployment Details

- Frontend is deployed on **Vercel**: https://sf-six-puce.vercel.app
- Backend is deployed on **Render**: https://sf-tydj.onrender.com
- Backend CORS is configured to allow:
  - `https://sf-six-puce.vercel.app`
  - `http://localhost:5173`

This enables browser-based cross-origin calls from deployed and local frontend environments.

## Why This Project Matters

This is a portfolio-ready project that demonstrates:

- Full-stack engineering capability across UI, API, and deployment.
- ML pipeline understanding from dataset/training to serving inference in production style.
- Product thinking by converting a notebook workflow into a usable web application.
- Real-world debugging and integration experience (including CORS and cross-origin API calls).

## Future Improvements

- Upgrade model experimentation (e.g., ensemble methods, calibration, and model comparison).
- Add prediction caching for repeated input combinations.
- Introduce user history to track and compare past recommendations.
- Add lightweight GenAI explanations for prediction rationale and agronomy tips.
- Improve mobile responsiveness and accessibility coverage.
- Add monitoring dashboards for API latency and model health metrics.

## Screenshots

- Add screenshot here (landing/form view)
- Add screenshot here (prediction result view)
- Add screenshot here (error/validation state)
