import React from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, 
  Badge, Chip, Box, useTheme 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { MarginStatus } from '../services/api';

interface HeaderProps {
  marginStatus: MarginStatus | null;
  onRefresh: () => void;
  lastUpdated: Date;
}

const Header: React.FC<HeaderProps> = ({ marginStatus, onRefresh, lastUpdated }) => {
  const theme = useTheme();
  
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Risk Monitoring System
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {marginStatus && marginStatus.margin_call_triggered && (
            <Chip 
              label="MARGIN CALL" 
              color="error" 
              sx={{ 
                fontWeight: 'bold',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 }
                }
              }}
            />
          )}
          
          <Typography variant="body2" color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          
          <IconButton color="inherit" onClick={onRefresh} title="Refresh data">
            <RefreshIcon />
          </IconButton>
          
          <IconButton color="inherit" title="Notifications">
            <Badge badgeContent={marginStatus?.margin_call_triggered ? 1 : 0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" title="Account">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;