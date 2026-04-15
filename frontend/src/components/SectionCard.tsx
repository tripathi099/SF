import { Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <Card elevation={1} sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <div>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
