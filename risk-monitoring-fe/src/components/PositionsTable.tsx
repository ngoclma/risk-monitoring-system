import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography 
} from '@mui/material';
import { Position } from '../services/api';

interface PositionsTableProps {
  positions: Position[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>Client Positions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Cost Basis ($)</TableCell>
            <TableCell align="right">Current Price ($)</TableCell>
            <TableCell align="right">Market Value ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell component="th" scope="row">
                {position.symbol}
              </TableCell>
              <TableCell align="right">{position.quantity}</TableCell>
              <TableCell align="right">${position.cost_basis.toFixed(2)}</TableCell>
              <TableCell align="right">${position.current_price.toFixed(2)}</TableCell>
              <TableCell align="right">${position.market_value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PositionsTable;