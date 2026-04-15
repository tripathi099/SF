import {
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PredictionResult } from '../types';

type TopAlternativesTableProps = {
  result: PredictionResult | null;
};

export default function TopAlternativesTable({ result }: TopAlternativesTableProps) {
  if (!result) {
    return <Alert severity="info">Top alternatives will appear after generating a recommendation.</Alert>;
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="Top prediction alternatives">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Rank</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Crop</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2">Confidence</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.top_3_predictions.map((prediction, index) => {
            const percentage = Math.round(prediction.confidence * 1000) / 10;
            return (
              <TableRow key={prediction.crop} hover>
                <TableCell>
                  <Chip label={`#${index + 1}`} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{prediction.crop}</TableCell>
                <TableCell align="right">{percentage}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
