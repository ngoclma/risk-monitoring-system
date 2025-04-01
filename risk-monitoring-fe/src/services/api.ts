import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Position {
  id: number;
  symbol: string;
  quantity: number;
  cost_basis: number;
  current_price: number;
  market_value: number;
}

export interface MarginStatus {
  portfolio_market_value: number;
  loan_amount: number;
  net_equity: number;
  margin_requirement: number;
  margin_shortfall: number;
  margin_call_triggered: boolean;
  positions: {
    symbol: string;
    quantity: number;
    current_price: number;
    position_value: number;
  }[];
}

export const getPositions = async (clientId: number): Promise<Position[]> => {
  const response = await axios.get(`${API_BASE_URL}/positions/${clientId}`);
  return response.data;
};

export const getMarginStatus = async (clientId: number): Promise<MarginStatus> => {
  const response = await axios.get(`${API_BASE_URL}/margin-status/${clientId}`);
  return response.data;
};

export const getMarketData = async () => {
  const response = await axios.get(`${API_BASE_URL}/market-data`);
  return response.data;
};