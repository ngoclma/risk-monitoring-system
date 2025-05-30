import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress, Tab, Tabs, Snackbar, Alert } from '@mui/material';
import PositionsTable from '../components/PositionsTable';
import PortfolioCompositionChart from '../components/PortfolioCompositionChart';
import MarginHealthCard from '../components/MarginHealthCard';
import PriceHistoryChart from '../components/PriceHistoryChart';
import Header from '../components/Header';
import PortfolioSummary from '../components/PortfolioSummary';
import ScenarioSimulator from '../components/ScenarioSimulator';
import { getPositions, getMarginStatus, Position, MarginStatus } from '../services/api';
import { mockPositions, mockMarginStatus } from '../mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [clientId] = useState<number>(1); // Default client ID
  const [positions, setPositions] = useState<Position[]>([]);
  const [marginStatus, setMarginStatus] = useState<MarginStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const [marginCallTriggered, setMarginCallTriggered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (marginStatus && marginStatus.margin_call_triggered) {
      // Trigger margin call alert
      setMarginCallTriggered(true);
      setShowAlert(true);
    } else {
      setMarginCallTriggered(false);
    }
  }, [marginStatus]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [positionsData, marginStatusData] = await Promise.all([
        getPositions(clientId),
        getMarginStatus(clientId)
      ]);

      setPositions(positionsData);
      setMarginStatus(marginStatusData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.warn('API fetch failed, falling back to mock data:', err);
      
      setPositions(mockPositions);
      setMarginStatus(mockMarginStatus);
      setLastUpdated(new Date());
      
      if (!mockPositions || !mockMarginStatus) {
        setError('Failed to load data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchData();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 60000); // Poll every minute

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {marginStatus && (
        <Header
          marginStatus={marginStatus}
          onRefresh={fetchData}
          lastUpdated={lastUpdated}
        />
      )}

      <Container maxWidth="lg" sx={{ flex: 1, mb: 4 }}>
        {marginStatus && positions.length > 0 && (
          <>
            <PortfolioSummary
              positions={positions}
              marginStatus={marginStatus}
            />

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Overview" />
                <Tab label="Positions" />
                <Tab label="Scenario Analysis" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(560px, 1fr))',
                  gap: 2,
                  mb: 4,
                }}
              >
                <MarginHealthCard marginStatus={marginStatus} />
                <PortfolioCompositionChart positions={positions} />
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
            <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, 1fr)',
                  gap: 2,
                  mb: 4,
                }}
              >
              <PositionsTable
                positions={positions}
              />
              <Box sx={{ mt: 3}}>
                <PriceHistoryChart positions={positions} />
              </Box>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <ScenarioSimulator
                positions={positions}
                marginStatus={marginStatus}
              />
            </TabPanel>
          </>
        )}

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
            Margin Call Triggered! Please take action to restore margin health.
          </Alert>
        </Snackbar>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          bgcolor: 'primary.main',
          color: 'secondary.main',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ fontFamily: 'Public Sans, Arial, sans-serif' }}>
            © {new Date().getFullYear()} Risk Management Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;