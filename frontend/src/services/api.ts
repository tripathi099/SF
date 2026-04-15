import type { FeatureKey, PredictionResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export type PredictionRequest = Record<FeatureKey, number>;

export async function predictCrop(payload: PredictionRequest): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail = errorBody?.detail ?? `Request failed with status ${response.status}`;
    throw new Error(String(detail));
  }

  const data = (await response.json()) as PredictionResult;
  return data;
}
