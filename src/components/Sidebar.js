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
  Assessment,
  Devices,
  ListAlt,
  TextSnippet,
  Help,
  HealthAndSafety,
  AdminPanelSettings,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

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

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 65;

function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, canAccessPage, hasPermission, isMaster, isAdmin } = useAuth();

  const allMenuItems = [
    { text: 'Home', icon: <Dashboard sx={{ fontSize: 22 }} />, path: '/', color: '#2563eb', requiresAuth: true },
    { text: 'Models', icon: <Psychology sx={{ fontSize: 22 }} />, path: '/models', color: '#7c3aed', requiredPage: 'models' },
    { text: 'Deployment', icon: <RocketLaunch sx={{ fontSize: 22 }} />, path: '/run-script', color: '#0891b2', requiredPage: 'monitoring' },
    { text: 'Train Model', icon: <Science sx={{ fontSize: 22 }} />, path: '/train-model', color: '#059669', requiredPage: 'training' },
    { text: 'Custom Models', icon: <Architecture sx={{ fontSize: 22 }} />, path: '/custom-models', color: '#c026d3', requiredPermission: 'canAccessCustomModels', requiredPage: 'customModels' },
    { text: 'Infer Models Video', icon: <MovieFilter sx={{ fontSize: 22 }} />, path: '/infer-video', color: '#dc2626', requiredPage: 'models' },
    { text: 'Infer Custom Model Video', icon: <SmartDisplay sx={{ fontSize: 22 }} />, path: '/infer-custom-video', color: '#6366f1', requiredPermission: 'canAccessCustomModels', requiredPage: 'customModels' },
    { text: 'Live Monitor', icon: <MonitorHeart sx={{ fontSize: 22 }} />, path: '/live-monitor', color: '#0d9488', requiredPage: 'monitoring' },
    { text: 'Forecasting', icon: <Analytics sx={{ fontSize: 22 }} />, path: '/forecasting', color: '#ea580c', requiredPage: 'forecasting' },
    { text: 'Device Management', icon: <Videocam sx={{ fontSize: 22 }} />, path: '/device-management', color: '#0369a1', requiredPage: 'devices' },
    { text: 'Log Viewer', icon: <TextSnippet sx={{ fontSize: 22 }} />, path: '/log-viewer', color: '#0d9488', requiredPage: 'logs' },
    { text: 'Safety Dashboard', icon: <HealthAndSafety sx={{ fontSize: 22 }} />, path: '/safety-dashboard', color: '#e11d48', requiredPage: 'incidents' },
    { text: 'User Management', icon: <AdminPanelSettings sx={{ fontSize: 22 }} />, path: '/user-management', color: '#f59e0b', requiredPermission: 'canManageUsers' },
    { text: 'User Guide', icon: <Help sx={{ fontSize: 22 }} />, path: '/guide', color: '#8b5cf6', requiresAuth: false },
  ];

  // Filter menu items based on user permissions
  const getVisibleMenuItems = () => {
    return allMenuItems.filter(item => {
      // Always show items that don't require auth
      if (item.requiresAuth === false) return true;
      
      // Hide items if user is not authenticated
      if (!user) return false;
      
      // Master users see everything
      if (isMaster()) return true;
      
      // For non-master users, check all requirements
      let hasAccess = true;
      
      // Check page permission if required
      if (item.requiredPage) {
        hasAccess = hasAccess && canAccessPage(item.requiredPage);
      }
      
      // Check feature permission if required
      if (item.requiredPermission) {
        hasAccess = hasAccess && hasPermission(item.requiredPermission);
      }
      
      // If item only requires auth (like Home), check if user has at least one permission
      if (item.requiresAuth && !item.requiredPage && !item.requiredPermission) {
        // Show Home to all authenticated users
        hasAccess = true;
      }
      
      return hasAccess;
    });
  };

  const menuItems = getVisibleMenuItems();

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
                      color: location.pathname === item.path ? item.color : '#6B7280',
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
                        color: location.pathname === item.path ? item.color : '#1F2937',
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