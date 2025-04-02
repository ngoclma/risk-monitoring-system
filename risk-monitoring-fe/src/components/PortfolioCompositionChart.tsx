import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { Position } from '../services/api';

interface PortfolioCompositionChartProps {
  positions: Position[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const PortfolioCompositionChart: React.FC<PortfolioCompositionChartProps> = ({ positions }) => {
  // Prepare data for pie chart
  const data = positions.map((position) => ({
    name: position.symbol,
    value: position.market_value,
  }));

  // Calculate total portfolio value
  const totalValue = positions.reduce((sum, position) => sum + position.market_value, 0);

  return (
    <Paper sx={{ p: 2, height: '100%', width: '100%'}}>
      <Typography variant="h6" gutterBottom>
        Portfolio Composition
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: '80%', width: '100%', position: 'relative' }}>
        {positions.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                labelFormatter={(name) => `${name}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No positions to display
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="body2" align="center" color="text.secondary">
        Total Value: ${totalValue.toFixed(2)}
      </Typography>
    </Paper>
  );
};

export default PortfolioCompositionChart;