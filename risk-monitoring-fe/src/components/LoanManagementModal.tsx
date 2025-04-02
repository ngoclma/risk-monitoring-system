import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { MarginStatus, payLoan, increaseLoan } from '../services/api';

interface LoanManagementModalProps {
  open: boolean;
  onClose: () => void;
  marginStatus: MarginStatus;
  clientId: number;
  onSuccess: () => void;
}

const LoanManagementModal: React.FC<LoanManagementModalProps> = ({
  open,
  onClose,
  marginStatus,
  clientId,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const maxLoanIncrease = marginStatus.portfolio_market_value * 0.5 - marginStatus.loan_amount;

  const handlePayLoan = async () => {
    try {
      await payLoan(clientId, amount);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to process loan payment');
    }
  };

  const handleIncreaseLoan = async () => {
    if (amount > maxLoanIncrease) {
      setError('Amount exceeds maximum allowable loan');
      return;
    }
    try {
      await increaseLoan(clientId, amount);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to process loan increase');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: 400,
        borderRadius: 1,
      }}>
        <Typography variant="h6" gutterBottom>Manage Loan</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Maximum additional loan available: ${maxLoanIncrease.toFixed(2)}
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handlePayLoan}>
            Pay Loan
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleIncreaseLoan}
            disabled={amount > maxLoanIncrease}
          >
            Loan More
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LoanManagementModal;