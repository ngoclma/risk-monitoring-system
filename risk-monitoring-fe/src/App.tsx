import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // Dark blue
    },
    secondary: {
      main: '#FFFFFF',
    },
    error: {
      main: '#D32F2F', // Red for alerts
    },
    background: {
      default: '#FAFAFA',
    },
  },
  typography: {
    fontFamily: 'Public Sans, Arial, sans-serif',
    h1: {
      fontFamily: 'Frank Ruhl Libre, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Frank Ruhl Libre, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Frank Ruhl Libre, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Frank Ruhl Libre, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Frank Ruhl Libre, serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Public Sans, Arial, sans-serif',
    },
    body2: {
      fontFamily: 'Public Sans, Arial, sans-serif',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;