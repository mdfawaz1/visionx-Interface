// src/components/Footer.js
import React from 'react';
import { Typography, Box } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        zIndex: 1201, // To be above the content
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} VisionX Dashboard. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;