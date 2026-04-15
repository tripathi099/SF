import AgricultureIcon from '@mui/icons-material/Agriculture';
import {
  Alert,
  AppBar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { predictCrop } from '../services/api';
import type { FeatureKey, PredictionResult } from '../types';
import PredictionInputForm from './PredictionInputForm';
import PredictionResultCard from './PredictionResultCard';
import SectionCard from './SectionCard';
import TopAlternativesTable from './TopAlternativesTable';

export default function AppShell() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const handleGenerateRecommendation = async (values: Record<FeatureKey, number>) => {
    setIsSubmitting(true);
    setRequestError(null);

    try {
      const response = await predictCrop(values);
      setResult(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error while calling the backend API.';
      setRequestError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AgricultureIcon color="primary" />
            <Typography variant="h6" component="h1">
              Crop Recommendation Demo
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Chip label="Connected" color="primary" variant="outlined" size="small" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={4}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
            <Stack spacing={1.5}>
              <Typography variant="h3">Smart Farming Assistant</Typography>
              <Typography variant="h6" color="text.secondary">
                Enter environmental values and get a crop recommendation from the backend model API.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Contract-aligned integration with backend response fields: recommended crop, confidence, alternatives, and model status.
              </Typography>
            </Stack>
          </Paper>

          {requestError ? <Alert severity="error">{requestError}</Alert> : null}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <SectionCard title="Input Parameters" subtitle="Provide soil and weather values.">
                <PredictionInputForm onGenerate={handleGenerateRecommendation} isSubmitting={isSubmitting} />
              </SectionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <SectionCard
                title="Recommendation Result"
                subtitle="Primary crop suggestion and confidence from backend inference."
              >
                <PredictionResultCard result={result} />
              </SectionCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <SectionCard
                title="Top Alternatives"
                subtitle="Top 3 ranked crops returned by the backend API."
              >
                <TopAlternativesTable result={result} />
              </SectionCard>
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Live backend integration enabled. Configure API base URL with VITE_API_BASE_URL if needed.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
