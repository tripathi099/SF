import { Alert, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import type { FeatureKey, PredictionFormValues } from '../types';

const FIELD_CONFIG: Array<{
  key: FeatureKey;
  label: string;
  helperText: string;
  min: number;
  max: number;
}> = [
  { key: 'N', label: 'Nitrogen (N)', helperText: 'Recommended range: 0 - 150', min: 0, max: 150 },
  { key: 'P', label: 'Phosphorus (P)', helperText: 'Recommended range: 0 - 150', min: 0, max: 150 },
  { key: 'K', label: 'Potassium (K)', helperText: 'Recommended range: 0 - 220', min: 0, max: 220 },
  { key: 'temperature', label: 'Temperature (°C)', helperText: 'Recommended range: 0 - 50', min: 0, max: 50 },
  { key: 'humidity', label: 'Humidity (%)', helperText: 'Recommended range: 0 - 100', min: 0, max: 100 },
  { key: 'ph', label: 'Soil pH', helperText: 'Recommended range: 0 - 14', min: 0, max: 14 },
  { key: 'rainfall', label: 'Rainfall (mm)', helperText: 'Recommended range: 0 - 400', min: 0, max: 400 },
];

const DEFAULT_VALUES: PredictionFormValues = {
  N: '',
  P: '',
  K: '',
  temperature: '',
  humidity: '',
  ph: '',
  rainfall: '',
};

type PredictionInputFormProps = {
  onGenerate: (values: Record<FeatureKey, number>) => Promise<void>;
  isSubmitting: boolean;
};

export default function PredictionInputForm({ onGenerate, isSubmitting }: PredictionInputFormProps) {
  const [values, setValues] = useState<PredictionFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FeatureKey, string>>>({});
  const [showValidationBanner, setShowValidationBanner] = useState(false);

  const isDirty = useMemo(() => Object.values(values).some((value) => value.trim() !== ''), [values]);

  const validate = (): { isValid: boolean; parsedValues: Record<FeatureKey, number> | null } => {
    const nextErrors: Partial<Record<FeatureKey, string>> = {};
    const parsedValues = {} as Record<FeatureKey, number>;

    FIELD_CONFIG.forEach(({ key, min, max }) => {
      const rawValue = values[key].trim();

      if (!rawValue) {
        nextErrors[key] = 'This field is required.';
        return;
      }

      const numericValue = Number(rawValue);
      if (Number.isNaN(numericValue)) {
        nextErrors[key] = 'Please enter a valid numeric value.';
        return;
      }

      if (numericValue < min || numericValue > max) {
        nextErrors[key] = `Value must be between ${min} and ${max}.`;
        return;
      }

      parsedValues[key] = numericValue;
    });

    const isValid = Object.keys(nextErrors).length === 0;
    setErrors(nextErrors);
    setShowValidationBanner(!isValid);

    return { isValid, parsedValues: isValid ? parsedValues : null };
  };

  const handleChange = (key: FeatureKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleGenerate = async () => {
    const { isValid, parsedValues } = validate();
    if (!isValid || !parsedValues) {
      return;
    }

    setShowValidationBanner(false);
    await onGenerate(parsedValues);
  };

  const handleReset = () => {
    setValues(DEFAULT_VALUES);
    setErrors({});
    setShowValidationBanner(false);
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Enter soil nutrients and weather conditions to generate a recommendation from the backend model.
      </Typography>

      {showValidationBanner ? (
        <Alert severity="warning">Please fix validation errors before generating a recommendation.</Alert>
      ) : null}

      <Grid container spacing={2}>
        {FIELD_CONFIG.map(({ key, label, helperText }) => (
          <Grid key={key} size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={label}
              value={values[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              error={Boolean(errors[key])}
              helperText={errors[key] ?? helperText}
              type="number"
              inputProps={{ step: 'any' }}
              disabled={isSubmitting}
            />
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleReset} disabled={!isDirty || isSubmitting}>
          Reset
        </Button>
        <Button variant="contained" onClick={handleGenerate} disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Recommendation'}
        </Button>
      </Stack>
    </Stack>
  );
}
