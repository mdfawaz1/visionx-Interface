// src/pages/Home.js
import React from 'react';
import { Typography, Container } from '@mui/material';

function Home() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the VisionX Dashboard
      </Typography>
      <Typography variant="body1">
        Use the sidebar to navigate through the features.
      </Typography>
    </Container>
  );
}

export default Home;