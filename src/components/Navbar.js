// src/components/TopNavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function TopNavBar() {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1201, 
        background: 'linear-gradient(45deg, #0d47a1, #1e88e5)',
        boxShadow: '0px 4px 10px rgba(0, 0, 139, 0.6)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontWeight: 'bold',
              color: '#BBDEFB',
              textShadow: '0px 0px 8px rgba(0, 174, 239, 1)',
              letterSpacing: '0.15em',
              fontSize: '1.5rem',
              marginRight: '6px',
            }}
          >
            VisionX
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#90CAF9',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              position: 'relative',
              top: '-8px',
              opacity: 0.85,
            }}
          >
            (Beta 0.1.0)
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
