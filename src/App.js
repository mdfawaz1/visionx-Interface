// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material'; // Import necessary MUI components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainRoutes from './MainRoutes';
import Footer from './components/Footer';

const drawerWidth = 240; // Define the width of the sidebar

function App() {
  return (
    <Router>
      <CssBaseline /> {/* Normalize CSS and set base styles */}
      <Box sx={{ display: 'flex', height: '100vh' }}> {/* Set up a flex container for the layout */}
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 2, // Add some padding for main content
            marginTop: 8, // Adjust for the height of the AppBar
            overflowY: 'auto', // Allow scrolling if content overflows
          }}
        >
          <MainRoutes /> {/* This will render your routes */}
        </Box>
      </Box>
      {/* <Footer /> Place the footer outside the flex container for full-width */}
    </Router>
  );
}

export default App;
