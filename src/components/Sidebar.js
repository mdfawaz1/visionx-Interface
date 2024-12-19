import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard,
  Psychology,
  RocketLaunch,
  Science,
  Architecture,
  MovieFilter,
  SmartDisplay,
  MonitorHeart,
  Analytics,
  ChevronLeft,
  ChevronRight,
  Videocam,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          overflowX: 'hidden',
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          margin: '4px 0',
          padding: '6px 8px',
        }
      }
    }
  }
});

const DRAWER_WIDTH = 240;  // Keep original width
const COLLAPSED_DRAWER_WIDTH = 65;  // Keep original width

function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        { text: 'Home', icon: <Dashboard sx={{ fontSize: 22 }} />, path: '/', color: '#2563eb' },
        { text: 'Models', icon: <Psychology sx={{ fontSize: 22 }} />, path: '/models', color: '#7c3aed' },
        { text: 'Deployment', icon: <RocketLaunch sx={{ fontSize: 22 }} />, path: '/run-script', color: '#0891b2' },
        { text: 'Train Model', icon: <Science sx={{ fontSize: 22 }} />, path: '/train-model', color: '#059669' },
        { text: 'Custom Models', icon: <Architecture sx={{ fontSize: 22 }} />, path: '/custom-models', color: '#c026d3' },
        { text: 'Infer Models Video', icon: <MovieFilter sx={{ fontSize: 22 }} />, path: '/infer-video', color: '#dc2626' },
        { text: 'Infer Custom Model Video', icon: <SmartDisplay sx={{ fontSize: 22 }} />, path: '/infer-custom-video', color: '#6366f1' },
        { text: 'Live Monitor', icon: <MonitorHeart sx={{ fontSize: 22 }} />, path: '/live-monitor', color: '#0d9488' },
        { text: 'Forecasting', icon: <Analytics sx={{ fontSize: 22 }} />, path: '/forecasting', color: '#ea580c' },
        { text: 'Device Management', icon: <Videocam sx={{ fontSize: 22 }} />, path: '/device-management', color: '#0369a1' },
      ];
    } else {
      return [
        { text: 'Live Monitor', icon: <MonitorHeart sx={{ fontSize: 22 }} />, path: '/live-monitor', color: '#0d9488' },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            position: 'fixed',
            left: 0,
            height: '100%',
            zIndex: 1200,
          },
        }}
      >
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pt: '64px', // Add padding for navbar
        }}>
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              position: 'absolute',
              right: -1,
              top: 72,
              width: 24,
              height: 24,
              background: 'transparent',
              color: '#64748b',
              border: 'none',
              zIndex: 1300,
              '&:hover': {
                background: 'transparent',
                color: '#2563eb',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              padding: 0,
            }}
          >
            {isCollapsed ? <ChevronRight sx={{ fontSize: 18 }} /> : <ChevronLeft sx={{ fontSize: 18 }} />}
          </IconButton>

          <List sx={{ px: 1.5, py: 2 }}>
            {menuItems.map((item) => (
              <Tooltip
                key={item.text}
                title={isCollapsed ? item.text : ''}
                placement="right"
                arrow
              >
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: '10px',
                    height: '50px',
                    mb: 1,
                    position: 'relative',
                    bgcolor: location.pathname === item.path ? `${item.color}10` : 'transparent',
                    '&:hover': {
                      bgcolor: `${item.color}15`,
                      '& .MuiListItemIcon-root': {
                        color: item.color,
                        transform: 'translateX(4px)',
                      },
                      '& .MuiListItemText-primary': {
                        color: item.color,
                      }
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === item.path ? item.color : '#64748b',
                      minWidth: isCollapsed ? '100%' : '40px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: isCollapsed ? 0 : 1,
                      transition: 'all 0.2s ease-in-out',
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem',
                        color: location.pathname === item.path ? item.color : '#334155',
                      },
                    }}
                  />
                  {location.pathname === item.path && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '60%',
                        background: item.color,
                        borderRadius: '4px 0 0 4px',
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default Sidebar;