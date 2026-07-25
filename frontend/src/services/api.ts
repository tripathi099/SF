import type { ApiHealth, FeatureKey, PredictionResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
const API_TIMEOUT_MS = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 45_000;

export type PredictionRequest = Record<FeatureKey, number>;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The prediction service took too long to respond. Please try again.');
    }
    throw new Error('The prediction service is temporarily unavailable. Please try again.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function publicApiError(status: number): Error {
  if (status === 422) {
    return new Error('One or more values are outside the supported range. Please review the form.');
  }
  if (status === 503) {
    return new Error('The prediction model is temporarily unavailable. Please try again later.');
  }
  return new Error('The prediction service could not complete the request. Please try again.');
}

export async function getApiHealth(): Promise<ApiHealth> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw publicApiError(response.status);
  }
  return (await response.json()) as ApiHealth;
}

export async function predictCrop(payload: PredictionRequest): Promise<PredictionResult> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw publicApiError(response.status);
  }

  const data = (await response.json()) as PredictionResult;
  return data;
}
