// src/components/TopNavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function TopNavBar() {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1201, 
        background: 'linear-gradient(45deg, #0d47a1, #1e88e5)',  // Dark to light blue gradient
        boxShadow: '0px 4px 10px rgba(0, 0, 139, 0.6)',          // Deep shadow for depth
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{
            fontFamily: '"Roboto Mono", monospace',              // Monospace font for a techy look
            fontWeight: 'bold',
            color: '#BBDEFB',                                    // Light blue text color
            textShadow: '0px 0px 8px rgba(0, 174, 239, 1)',      // Strong neon glow effect
            letterSpacing: '0.15em',                             // Increased letter spacing
            fontSize: '1.5rem',                                  // Larger font size for impact
          }}
        >
          VisionX
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
