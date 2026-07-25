export type FeatureKey =
  | 'N'
  | 'P'
  | 'K'
  | 'temperature'
  | 'humidity'
  | 'ph'
  | 'rainfall';

export type PredictionFormValues = Record<FeatureKey, string>;

export type ApiHealth = {
  status: string;
  model_status: string;
};

export type PredictionResult = {
  recommended_crop: string;
  confidence: number;
  top_3_predictions: Array<{
    crop: string;
    confidence: number;
  }>;
  model_status: string;
};
