import AgricultureIcon from '@mui/icons-material/Agriculture';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getApiHealth, predictCrop } from '../services/api';
import type { FeatureKey, PredictionResult } from '../types';
import PredictionInputForm from './PredictionInputForm';
import PredictionResultCard from './PredictionResultCard';
import SectionCard from './SectionCard';
import TopAlternativesTable from './TopAlternativesTable';

export default function AppShell() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlowNotice, setShowSlowNotice] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const slowNoticeTimer = useRef<number | null>(null);

  const checkService = useCallback(async () => {
    setServiceStatus('checking');
    try {
      const health = await getApiHealth();
      setServiceStatus(health.status === 'ok' && health.model_status === 'ready' ? 'ready' : 'unavailable');
    } catch {
      setServiceStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    void checkService();
  }, [checkService]);

  useEffect(
    () => () => {
      if (slowNoticeTimer.current !== null) {
        window.clearTimeout(slowNoticeTimer.current);
      }
    },
    [],
  );

  const handleGenerateRecommendation = async (values: Record<FeatureKey, number>) => {
    setIsSubmitting(true);
    setResult(null);
    setRequestError(null);
    setShowSlowNotice(false);
    slowNoticeTimer.current = window.setTimeout(() => setShowSlowNotice(true), 1_500);

    try {
      const response = await predictCrop(values);
      setResult(response);
      setServiceStatus(response.model_status === 'ready' ? 'ready' : 'unavailable');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error while calling the backend API.';
      setRequestError(message);
      setServiceStatus('unavailable');
    } finally {
      if (slowNoticeTimer.current !== null) {
        window.clearTimeout(slowNoticeTimer.current);
        slowNoticeTimer.current = null;
      }
      setShowSlowNotice(false);
      setIsSubmitting(false);
    }
  };

  const serviceLabel = {
    checking: 'Checking service',
    ready: 'Model ready',
    unavailable: 'Service unavailable',
  }[serviceStatus];

  const serviceColor = serviceStatus === 'ready' ? 'success' : serviceStatus === 'unavailable' ? 'warning' : 'default';

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
          <Chip label={serviceLabel} color={serviceColor} variant="outlined" size="small" />
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

          {showSlowNotice ? (
            <Alert severity="info">
              The prediction service is starting. The first request after an idle period can take a little longer.
            </Alert>
          ) : null}

          {requestError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => void checkService()}>
                  Check service
                </Button>
              }
            >
              {requestError} Your entered values are preserved so you can try again.
            </Alert>
          ) : null}

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
            Demonstration only—not agronomic advice. Configure the API base URL with VITE_API_BASE_URL.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
