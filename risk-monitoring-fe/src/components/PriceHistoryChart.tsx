import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Paper, Typography, Box, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent, Divider
} from '@mui/material';
import { Position } from '../services/api';

interface PriceHistoryProps {
  positions: Position[];
}

// Simulated price history data (in a real app, we will fetch this from an API)
const generatePriceHistory = (symbol: string, currentPrice: number) => {
  const days = 30;
  const volatility = 0.02; // 2% daily volatility
  const history = [];
  
  let price = currentPrice * (1 - (Math.random() * volatility * days));
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward bias
    price = price * (1 + (Math.random() * volatility - volatility/2 + 0.001));
    
    history.push({
      date: date.toLocaleDateString(),
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return history;
};

const PriceHistoryChart: React.FC<PriceHistoryProps> = ({ positions }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [priceData, setPriceData] = useState<any[]>([]);
  
  useEffect(() => {
    if (positions.length > 0 && !selectedSymbol) {
      setSelectedSymbol(positions[0].symbol);
    }
  }, [positions, selectedSymbol]);
  
  useEffect(() => {
    if (selectedSymbol) {
      const position = positions.find(p => p.symbol === selectedSymbol);
      if (position) {
        const history = generatePriceHistory(selectedSymbol, position.current_price);
        setPriceData(history);
      }
    }
  }, [selectedSymbol, positions]);
  
  const handleSymbolChange = (event: SelectChangeEvent<string>) => {
    setSelectedSymbol(event.target.value);
  };
  
  return (
    <Paper sx={{ p: 2, height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Price History</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Symbol</InputLabel>
          <Select
            value={selectedSymbol}
            label="Symbol"
            onChange={handleSymbolChange}
          >
            {positions.map(position => (
              <MenuItem key={position.symbol} value={position.symbol}>
                {position.symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ height: '84%' }}>
        {priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => `$${tick}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                dot={false}
                name={selectedSymbol}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No price data available
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PriceHistoryChart;