import React from 'react';
import {
  Grid,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  useTheme,
  Divider,
  Chip
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  ViewList,
  Code,
  Refresh,
  Settings,
  NotificationsActive
} from '@mui/icons-material';

const LogHeader = ({ 
  darkMode, 
  setDarkMode, 
  viewMode, 
  setViewMode, 
  autoRefresh, 
  setAutoRefresh, 
  refreshInterval, 
  setRefreshInterval 
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(90deg, #1a237e 0%, #303f9f 100%)' 
          : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <NotificationsActive sx={{ mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Log Viewer</Typography>
            <Typography variant="subtitle1">
              Real-time system monitoring and log analysis
            </Typography>
          </Box>
        </Box>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems="center"
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton 
              onClick={() => setDarkMode(!darkMode)}
              sx={{ 
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />

          <Tooltip title={viewMode === 'formatted' ? "Switch to Raw View" : "Switch to Formatted View"}>
            <IconButton 
              onClick={() => setViewMode(viewMode === 'formatted' ? 'raw' : 'formatted')}
              sx={{ 
                bgcolor: viewMode === 'formatted' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              {viewMode === 'formatted' ? <ViewList /> : <Code />}
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />

          <Tooltip title={autoRefresh ? "Turn Off Auto Refresh" : "Turn On Auto Refresh"}>
            <Box>
              <IconButton 
                onClick={() => setAutoRefresh(!autoRefresh)}
                sx={{ 
                  position: 'relative',
                  bgcolor: autoRefresh ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                }}
              >
                <Badge
                  badgeContent={autoRefresh ? refreshInterval : null}
                  color="error"
                  overlap="circular"
                >
                  <Refresh />
                </Badge>
              </IconButton>
            </Box>
          </Tooltip>

          {autoRefresh && (
            <TextField
              size="small"
              type="number"
              label="Refresh (sec)"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Math.max(1, parseInt(e.target.value) || 10))}
              InputProps={{ 
                inputProps: { min: 1 },
                sx: { 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.8)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white'
                  }
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
              sx={{ width: 120 }}
            />
          )}
        </Stack>
      </Box>

      {/* Status Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 2 
        }}
      >
        <Stack direction="row" spacing={1}>
          <Chip 
            size="small" 
            label={darkMode ? "Dark Mode" : "Light Mode"} 
            icon={darkMode ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Chip 
            size="small"
            label={viewMode === 'formatted' ? "Formatted View" : "Raw View"}
            icon={viewMode === 'formatted' ? <ViewList fontSize="small" /> : <Code fontSize="small" />}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Chip 
            size="small"
            label={autoRefresh ? `Auto-refresh: ${refreshInterval}s` : "Manual Refresh"}
            icon={<Refresh fontSize="small" />}
            color={autoRefresh ? "success" : "default"}
            sx={{ 
              bgcolor: autoRefresh ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        </Stack>
      </Box>
    </Paper>
  );
};

export default LogHeader; 