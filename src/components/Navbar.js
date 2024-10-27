// src/components/TopNavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function TopNavBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}> {/* Higher zIndex to stay above sidebar */}
      <Toolbar>
        <Typography variant="h6" component="div">
            VisionX 
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
