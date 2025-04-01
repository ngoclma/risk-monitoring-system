import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import PositionsTable from '../components/PositionsTable';
import MarginStatusCard from '../components/MarginStatusCard';
import { getPositions, getMarginStatus, Position, MarginStatus } from '../services/api';

const Dashboard: React.FC = () => {
  const [clientId] = useState<number>(1); // Default client ID
  const [positions, setPositions] = useState<Position[]>([]);
  const [marginStatus, setMarginStatus] = useState<MarginStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [positionsData, marginStatusData] = await Promise.all([
        getPositions(clientId),
        getMarginStatus(clientId)
      ]);
      
      setPositions(positionsData);
      setMarginStatus(marginStatusData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 60000); // Poll every minute
    
    return () => clearInterval(intervalId);
  }, [clientId]);

  if (loading && !marginStatus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Risk Monitoring Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}> */}
          {marginStatus && <MarginStatusCard marginStatus={marginStatus as MarginStatus} />}
        {/* </Grid> */}

        {/* <Grid item xs={12} md={8}> */}
          <PositionsTable positions={positions} />
        {/* </Grid> */}
      </Grid>
    </Container>
  );
};

export default Dashboard;