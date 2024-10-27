import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Home, Storage, CloudUpload, Build, AutoStories, VideoLibrary ,LiveTv} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a theme with the Inter font
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const drawerWidth = -20; // Reduced width

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Models', icon: <Storage />, path: '/models' },
    { text: 'Deployment', icon: <CloudUpload />, path: '/run-script' },
    { text: 'Train Model', icon: <Build />, path: '/train-model' },
    { text: 'Custom Models', icon: <AutoStories />, path: '/custom-models' },
    { text: 'Infer Video', icon: <VideoLibrary />, path: '/infer-video' },
    { text: 'Infer Custom Model Video', icon: <VideoLibrary />, path: '/infer-custom-video' },
    { text: 'Live Monitor', icon: <LiveTv />, path: '/live-monitor' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f8f9fa',
            borderRight: 'none',
            height: '100vh',
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {/* <Typography variant="h6" sx={{ padding: '16px', color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
            AI Engine
          </Typography> */}
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.text}
                sx={{
                  mb: 2, // Increased spacing between items
                  mx: 1,
                  borderRadius: '8px',
                  '&:hover': { 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    '& .MuiListItemIcon-root': { color: '#1976d2' },
                  },
                  '&.Mui-selected': { 
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '& .MuiListItemIcon-root': { color: '#1976d2' },
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? '#1976d2' : '#5f6368', // Updated icon color
                  minWidth: '40px',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? '600' : '400',
                    fontSize: '0.875rem',
                    color: '#202124', // Updated text color to match Google's default text color
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default Sidebar;