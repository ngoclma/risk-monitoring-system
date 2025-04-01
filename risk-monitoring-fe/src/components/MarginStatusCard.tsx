import React from 'react';
import { 
  Card, CardContent, Typography, Box, 
  Divider, Alert 
} from '@mui/material';
import { MarginStatus } from '../services/api';

interface MarginStatusCardProps {
  marginStatus: MarginStatus;
}

const MarginStatusCard: React.FC<MarginStatusCardProps> = ({ marginStatus }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Margin Status
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Portfolio Market Value:</Typography>
          <Typography>${marginStatus.portfolio_market_value.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Loan Amount:</Typography>
          <Typography>${marginStatus.loan_amount.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Net Equity:</Typography>
          <Typography>${marginStatus.net_equity.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Margin Requirement:</Typography>
          <Typography>${marginStatus.margin_requirement.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Margin Shortfall:</Typography>
          <Typography sx={{ 
            color: marginStatus.margin_shortfall > 0 ? 'error.main' : 'success.main' 
          }}>
            ${marginStatus.margin_shortfall.toFixed(2)}
          </Typography>
        </Box>
        
        {marginStatus.margin_call_triggered && (
          <Alert severity="error">
            MARGIN CALL TRIGGERED! Please add funds to your account.
          </Alert>
        )}
        
        {!marginStatus.margin_call_triggered && (
          <Alert severity="success">
            Your margin status is healthy.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MarginStatusCard;