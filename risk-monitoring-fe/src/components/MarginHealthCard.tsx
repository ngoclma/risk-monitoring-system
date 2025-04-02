import React from 'react';
import { 
  Card, CardContent, Typography, Box, 
  Divider, Alert, LinearProgress 
} from '@mui/material';
import { MarginStatus } from '../services/api';

interface MarginHealthCardProps {
  marginStatus: MarginStatus;
}

const MarginHealthCard: React.FC<MarginHealthCardProps> = ({ marginStatus }) => {
  const healthPercentage = Math.max(
    0,
    Math.min(100, ((marginStatus.net_equity - marginStatus.margin_requirement) / marginStatus.margin_requirement) * 100)
  );

  const getHealthColor = () => {
    if (healthPercentage > 50) return 'success.main';
    if (healthPercentage > 20) return 'warning.main';
    return 'error.main';
  };

  const getStatusText = () => {
    if (healthPercentage > 50) return 'Healthy';
    if (healthPercentage > 20) return 'At Risk';
    return 'Critical';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Margin Health
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Margin Status Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 8 }}>
          <Typography>Portfolio Market Value:</Typography>
          <Typography variant="h6">${marginStatus.portfolio_market_value.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 8 }}>
          <Typography>Loan Amount:</Typography>
          <Typography variant="h6">${marginStatus.loan_amount.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 8 }}>
          <Typography>Net Equity:</Typography>
          <Typography variant="h6">${marginStatus.net_equity.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 8 }}>
          <Typography>Margin Requirement:</Typography>
          <Typography variant="h6">${marginStatus.margin_requirement.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 8 }}>
          <Typography>Margin Shortfall:</Typography>
          <Typography
            variant="h6"
            sx={{
              color: marginStatus.margin_shortfall > 0 ? 'error.main' : 'success.main',
            }}
          >
            ${marginStatus.margin_shortfall.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Margin Health Gauge */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color={getHealthColor()} fontWeight="bold">
              {getStatusText()}
            </Typography>
            <Typography variant="body2">{healthPercentage.toFixed(1)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={healthPercentage}
            color={
              healthPercentage > 50
                ? 'success'
                : healthPercentage > 20
                ? 'warning'
                : 'error'
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

        {/* Alerts */}
        {marginStatus.margin_call_triggered && (
          <Alert severity="error" sx={{ mt: 2 }}>
            MARGIN CALL TRIGGERED! Please add funds to your account.
          </Alert>
        )}
        {!marginStatus.margin_call_triggered && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your margin status is healthy.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MarginHealthCard;