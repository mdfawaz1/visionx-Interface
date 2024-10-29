import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Box,
  Container,
  Grid,
  Fade,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Grow,
  useTheme,
} from '@mui/material';
import {
  Settings,
  CloudUpload,
  Check,
  Storage as StorageIcon,
  Code,
  Layers,
  Speed,
  Refresh,
  Memory ,
} from '@mui/icons-material';
import VideoFeed from './VideoFeed';
import api from '../api'
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const MotionPaper = motion(Paper);

function RunScript() {
  const [activeStep, setActiveStep] = useState(0);
  const [ipAddress, setIpAddress] = useState('');
  const [modelType, setModelType] = useState('pretrained');
  const [modelName, setModelName] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoRefreshCount, setVideoRefreshCount] = useState(0);
  const serverUrl = 'http://localhost:5007';
  const theme = useTheme();

  useEffect(() => {
    fetchModels();
  }, [modelType]);

  const fetchModels = () => {
    const endpoint = modelType === 'pretrained' ? '/models' : '/custom-models';
    api.get(endpoint)
      .then(response => setModels(response.data))
      .catch(error => console.error(`Error fetching ${modelType} models:`, error));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setShowVideo(false);
  };

  const handleExecute = async () => {
    if (!modelName || !ipAddress) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setShowVideo(true);

    setVideoRefreshCount(count => count + 1);
    setTimeout(() => {
      setVideoRefreshCount(count => count + 1);
    }, 5000);

    setLoading(true);

    try {
      const endpoint = modelType === 'pretrained' ? '/streams/run-script' : `/custom-model/${modelName}/run-script`;
      const payload = modelType === 'pretrained' ? { ipAddress, modelName } : { ipAddress };

      const response = await api.post(endpoint, payload);
      setMessage({ type: 'success', text: response.data.message });
      handleNext();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error executing script' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Model Type', 'Choose Model', 'Configure IP'];
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={1000}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <RadioGroup
                    aria-label="model-type"
                    name="model-type"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
                  >
                    <FormControlLabel
                      value="pretrained"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <StorageIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Pretrained Model</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="custom"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <Code fontSize="large" color="secondary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Custom Model</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Paper>
              </Grow>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            {models.map((model, index) => (
              <Grid item xs={12} sm={6} md={4} key={model._id || model.name}>
                <Grow in={true} timeout={500 + index * 100}>
                  <MotionPaper
                    elevation={3}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: modelName === model.name ? `2px solid ${theme.palette.primary.main}` : 'none',
                      bgcolor: modelName !== model.name ? 'background.paper' : 'primary.light',
                      '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.15)',
                      },
                    }}
                    onClick={() => setModelName(model.name)}
                  >
                    <Memory color="primary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6" align="center">
                      {model.name}
                    </Typography>
                  </MotionPaper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Fade in={true} timeout={1000}>
            <Box>
              <TextField
                label="IP Address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                }}
                InputProps={{
                  startAdornment: <Layers color="action" sx={{ mr: 1 }} />,
                }}
              />
              {showVideo && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Live Video Feed
                  </Typography>
                  <Paper
                    elevation={3}
                    sx={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 2,
                    }}
                  >
                    <VideoFeed key={`video-feed-${videoRefreshCount}`} serverUrl={serverUrl} />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Refresh />}
                      onClick={() => setVideoRefreshCount((count) => count + 1)}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        boxShadow: 3,
                      }}
                    >
                      Refresh Feed
                    </Button>
                  </Paper>
                </Box>
              )}
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
            Model Deployment
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {message && (
            <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }} variant="filled">
              {message.text}
            </Alert>
          )}

          <Box sx={{ mb: 4, minHeight: 300 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<Settings />}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleExecute}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                sx={{ minWidth: 150 }}
              >
                {loading ? 'Configuring...' : 'Configure'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<Speed />}
                sx={{ minWidth: 150 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>

        {activeStep === steps.length && (
          <Grow in={true} timeout={1000}>
            <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: 2, backgroundColor: '#e8f5e9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
                    Deployment Successful
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#388e3c' }}>
                    Your model has been successfully deployed and is now operational.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grow>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default RunScript;