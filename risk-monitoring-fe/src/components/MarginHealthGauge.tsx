import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { MarginStatus } from '../services/api';

interface MarginHealthGaugeProps {
  marginStatus: MarginStatus;
}

const MarginHealthGauge: React.FC<MarginHealthGaugeProps> = ({ marginStatus }) => {
  // Calculate health percentage based on margin status
  // Higher is better (no margin call)
  const marginBuffer = marginStatus.net_equity - marginStatus.margin_requirement;
  const healthPercentage = Math.min(100, Math.max(0, 
    marginBuffer > 0 
      ? Math.min(100, (marginBuffer / marginStatus.margin_requirement) * 100) 
      : 0
  ));

  // Determine color based on health
  const getHealthColor = () => {
    if (healthPercentage > 50) return 'success.main';
    if (healthPercentage > 20) return 'warning.main';
    return 'error.main';
  };

  // Determine status text
  const getStatusText = () => {
    if (marginStatus.margin_call_triggered) return 'MARGIN CALL';
    if (healthPercentage > 50) return 'HEALTHY';
    if (healthPercentage > 20) return 'CAUTION';
    return 'AT RISK';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Margin Health
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color={getHealthColor()} fontWeight="bold">
            {getStatusText()}
          </Typography>
          <Typography variant="body2">
            {healthPercentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={healthPercentage}
          color={
            healthPercentage > 50 ? 'success' : 
            healthPercentage > 20 ? 'warning' : 'error'
          }
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Buffer before margin call: ${Math.max(0, -marginStatus.margin_shortfall).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {marginStatus.margin_call_triggered 
            ? `Additional funds needed: $${marginStatus.margin_shortfall.toFixed(2)}`
            : 'No additional funds required at this time'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MarginHealthGauge;