import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Slider, TextField,
  Button, Divider, Alert, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { MarginStatus, Position } from '../services/api';

interface ScenarioSimulatorProps {
  positions: Position[];
  marginStatus: MarginStatus;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ positions, marginStatus }) => {
  const [marketChange, setMarketChange] = useState<number>(0);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');
  const [loanAmount, setLoanAmount] = useState<number>(marginStatus.loan_amount);
  const [simulatedStatus, setSimulatedStatus] = useState<MarginStatus | null>(null);
  
  useEffect(() => {
    // Reset when positions or margin status change
    setMarketChange(0);
    setLoanAmount(marginStatus.loan_amount);
    setSimulatedStatus(null);
  }, [positions, marginStatus]);
  
  const handleMarketChangeChange = (event: Event, newValue: number | number[]) => {
    setMarketChange(newValue as number);
  };
  
  const handleLoanAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setLoanAmount(isNaN(value) ? 0 : value);
  };
  
  const handleSymbolChange = (event: any) => {
    setSelectedSymbol(event.target.value);
  };
  
  const simulateScenario = () => {
    // Clone positions and apply market change
    const simulatedPositions = positions.map(pos => {
      let adjustedPrice = pos.current_price;
      
      // Apply market change based on selection
      if (selectedSymbol === 'all' || selectedSymbol === pos.symbol) {
        adjustedPrice = pos.current_price * (1 + marketChange / 100);
      }
      
      return {
        ...pos,
        current_price: adjustedPrice,
        market_value: pos.quantity * adjustedPrice
      };
    });
    
    // Calculate new portfolio market value
    const portfolioMarketValue = simulatedPositions.reduce(
      (sum, pos) => sum + pos.market_value, 0
    );
    
    // Calculate margin status
    const maintenaceMarginRate = 0.25; // 25% maintenance margin requirement as default
    const netEquity = portfolioMarketValue - loanAmount;
    const marginRequirement = maintenaceMarginRate * portfolioMarketValue;
    const marginShortfall = marginRequirement - netEquity;
    
    setSimulatedStatus({
      portfolio_market_value: portfolioMarketValue,
      loan_amount: loanAmount,
      net_equity: netEquity,
      margin_requirement: marginRequirement,
      margin_shortfall: marginShortfall,
      margin_call_triggered: marginShortfall > 0,
      positions: simulatedPositions.map(p => ({
        symbol: p.symbol,
        quantity: p.quantity,
        current_price: p.current_price,
        position_value: p.market_value
      }))
    });
  };
  
  const resetSimulation = () => {
    setMarketChange(0);
    setLoanAmount(marginStatus.loan_amount);
    setSelectedSymbol('all');
    setSimulatedStatus(null);
  };
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Scenario Simulator</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" paragraph>
        Adjust market conditions to see how they would affect your margin status.
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
          <InputLabel>Apply to</InputLabel>
          <Select
            value={selectedSymbol}
            onChange={handleSymbolChange}
            label="Apply to"
          >
            <MenuItem value="all">All Positions</MenuItem>
            {positions.map(pos => (
              <MenuItem key={pos.symbol} value={pos.symbol}>{pos.symbol}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography gutterBottom>Market Price Change: {marketChange}%</Typography>
        <Box sx={{ px: 2 }}>
            <Slider
                value={marketChange}
                onChange={handleMarketChangeChange}
                min={-50}
                max={50}
                step={1}
                marks={[
                    { value: -50, label: '-50%' },
                    { value: 0, label: '0%' },
                    { value: 50, label: '+50%' }
                ]}
                valueLabelDisplay="auto"
            />
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={handleLoanAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={simulateScenario}
          fullWidth
        >
          Simulate
        </Button>
        <Button 
          variant="outlined" 
          onClick={resetSimulation}
          fullWidth
        >
          Reset
        </Button>
      </Box>
      
      {simulatedStatus && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Simulation Results:</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Portfolio Value:</Typography>
            <Typography variant="body2" fontWeight="medium">
              ${simulatedStatus.portfolio_market_value.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Net Equity:</Typography>
            <Typography variant="body2" fontWeight="medium">
              ${simulatedStatus.net_equity.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Margin Requirement:</Typography>
            <Typography variant="body2" fontWeight="medium">
              ${simulatedStatus.margin_requirement.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">Margin Shortfall:</Typography>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              color={simulatedStatus.margin_shortfall > 0 ? 'error.main' : 'success.main'}
            >
              ${simulatedStatus.margin_shortfall.toFixed(2)}
            </Typography>
          </Box>
          
          {simulatedStatus.margin_call_triggered ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              In this scenario, a margin call would be triggered. You would need additional funds.
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mt: 1 }}>
              In this scenario, your margin status would remain healthy.
            </Alert>
          )}
        </>
      )}
    </Paper>
  );
};

export default ScenarioSimulator;