import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper
} from '@mui/material';
import { Position } from '../services/api';

interface PositionsTableProps {
  positions: Position[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  return (
    <TableContainer component={Paper} sx={{ p: 0 }}>
      <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'primary.main' }}>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Symbol</TableCell>
          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Cost Basis ($)</TableCell>
          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Current Price ($)</TableCell>
          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Market Value ($)</TableCell>
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