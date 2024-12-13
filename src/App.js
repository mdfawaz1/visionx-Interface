// src/App.js
import React from 'react';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainRoutes from './MainRoutes';

const drawerWidth = -20;

function AppContent() {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const isLoginPage = location.pathname === '/login';

  // Redirect to login if no user role is set
  if (!userRole && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // Don't show navbar and sidebar on login page
  if (isLoginPage) {
    return (
      <Box>
        <MainRoutes />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Navbar />
      {userRole && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 2,
          marginTop: 8,
          overflowY: 'auto',
          paddingLeft: `${drawerWidth}px`,
        }}
      >
        <MainRoutes />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppContent />
    </Router>
  );
}

export default App;
