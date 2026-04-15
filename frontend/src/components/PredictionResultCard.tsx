import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Alert,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import type { PredictionResult } from '../types';

type PredictionResultCardProps = {
  result: PredictionResult | null;
};

export default function PredictionResultCard({ result }: PredictionResultCardProps) {
  if (!result) {
    return (
      <Alert severity="info">
        No recommendation generated yet. Fill in input parameters and click <strong>Generate Recommendation</strong>.
      </Alert>
    );
  }

  const confidencePercentage = Math.round(result.confidence * 1000) / 10;

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <CheckCircleOutlineIcon color="success" />
        <Typography variant="h6">{result.recommended_crop}</Typography>
        <Chip label="Recommended" color="success" size="small" />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        Confidence score
      </Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, Math.max(0, confidencePercentage))}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography variant="body2" color="text.secondary">
        {confidencePercentage}%
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Model status:
        </Typography>
        <Chip label={result.model_status} size="small" variant="outlined" />
      </Stack>
    </Stack>
  );
}
