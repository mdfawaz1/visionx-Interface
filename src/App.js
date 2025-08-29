// src/App.js
import React from 'react';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainRoutes from './MainRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const drawerWidth = -20;

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const isGuidePage = location.pathname === '/guide';

  // Allow access to login page without authentication
  if (isLoginPage) {
    return (
      <Box>
        <MainRoutes />
      </Box>
    );
  }

  // For guide page, show full layout but don't require authentication
  if (isGuidePage && !loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Navbar />
        <Sidebar />
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

  // Show loading while checking authentication
  if (loading) {
    return null; // You could add a loading spinner here
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Navbar />
      <Sidebar />
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
      <AuthProvider>
        <CssBaseline />
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;