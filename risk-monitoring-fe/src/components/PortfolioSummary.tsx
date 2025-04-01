import React from 'react';
import { 
  Grid, Paper, Typography, Box,
  Divider, Chip
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { MarginStatus, Position } from '../services/api';

interface PortfolioSummaryProps {
  positions: Position[];
  marginStatus: MarginStatus;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ positions, marginStatus }) => {
  // Calculate some additional metrics
  const totalCost = positions.reduce((sum, pos) => sum + (pos.cost_basis * pos.quantity), 0);
  const totalValue = positions.reduce((sum, pos) => sum + (pos.current_price * pos.quantity), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  // Find best and worst performing positions
  const positionsWithPerformance = positions.map(pos => {
    const gainLoss = (pos.current_price - pos.cost_basis) / pos.cost_basis * 100;
    return { ...pos, gainLoss };
  });
  
  const bestPosition = [...positionsWithPerformance].sort((a, b) => b.gainLoss - a.gainLoss)[0];
  const worstPosition = [...positionsWithPerformance].sort((a, b) => a.gainLoss - b.gainLoss)[0];
  
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Portfolio Summary</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">Total Value</Typography>
            <Typography variant="h6">${totalValue.toFixed(2)}</Typography>
          </Box>
        
          <Box>
            <Typography variant="body2" color="text.secondary">Total Cost</Typography>
            <Typography variant="h6">${totalCost.toFixed(2)}</Typography>
          </Box>
        
          <Box>
            <Typography variant="body2" color="text.secondary">Net Equity</Typography>
            <Typography variant="h6">${marginStatus.net_equity.toFixed(2)}</Typography>
          </Box>
        
          <Box>
            <Typography variant="body2" color="text.secondary">Loan Amount</Typography>
            <Typography variant="h6">${marginStatus.loan_amount.toFixed(2)}</Typography>
          </Box>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">Total Gain/Loss</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}>
                ${totalGainLoss.toFixed(2)}
              </Typography>
              <Chip 
                size="small" 
                sx={{ ml: 1 }} 
                icon={totalGainLossPercent >= 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} 
                label={`${Math.abs(totalGainLossPercent).toFixed(2)}%`}
                color={totalGainLossPercent >= 0 ? 'success' : 'error'}
              />
            </Box>
          </Box>
        </Grid>
        
        {bestPosition && (
            <Box>
              <Typography variant="body2" color="text.secondary">Best Performer</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">{bestPosition.symbol}</Typography>
                <Chip 
                  size="small" 
                  sx={{ ml: 1 }} 
                  icon={<ArrowUpwardIcon />} 
                  label={`${bestPosition.gainLoss.toFixed(2)}%`}
                  color="success"
                />
              </Box>
            </Box>
        )}
        
        {worstPosition && (
            <Box>
              <Typography variant="body2" color="text.secondary">Worst Performer</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">{worstPosition.symbol}</Typography>
                <Chip 
                  size="small" 
                  sx={{ ml: 1 }} 
                  icon={<ArrowDownwardIcon />} 
                  label={`${worstPosition.gainLoss.toFixed(2)}%`}
                  color={worstPosition.gainLoss < 0 ? 'error' : 'success'}
                />
              </Box>
            </Box>
        )}
    </Paper>
  );
};

export default PortfolioSummary;