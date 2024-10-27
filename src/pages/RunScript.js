// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   useTheme,
//   Radio,
//   FormControlLabel,
//   RadioGroup,
// } from '@mui/material';
// import { Settings, CloudUpload, Check, Storage, Code } from '@mui/icons-material';
// import axios from 'axios';
// import VideoFeed from './VideoFeed';
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

// function RunScript() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [ipAddress, setIpAddress] = useState('');
//   const [modelType, setModelType] = useState('pretrained');
//   const [modelName, setModelName] = useState('');
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const theme = useTheme();
//   const serverUrl = 'http://localhost:5007'; 
//   useEffect(() => {
//     fetchModels();
//   }, [modelType]);

//   const fetchModels = () => {
//     const endpoint = modelType === 'pretrained' ? '/models' : '/custom-models';
//     api.get(endpoint)
//       .then(response => setModels(response.data))
//       .catch(error => console.error(`Error fetching ${modelType} models:`, error));
//   };

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleExecute = () => {
//     if (!modelName || !ipAddress) {
//       setMessage({ type: 'error', text: 'Please fill in all fields.' });
//       return;
//     }
//     setLoading(true);

//     const endpoint = modelType === 'pretrained' ? '/streams/run-script' : `/custom-model/${modelName}/run-script`;
//     const payload = modelType === 'pretrained' ? { ipAddress, modelName } : { ipAddress };

//     api.post(endpoint, payload)
//       .then(response => {
//         setMessage({ type: 'success', text: response.data.message });
//         setLoading(false);
//         handleNext();
//       })
//       .catch(error => {
//         setMessage({ type: 'error', text: 'Error executing script' });
//         setLoading(false);
//       });
//   };

//   const steps = ['Select Model Type', 'Choose Model', 'Configure IP'];

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <RadioGroup
//             aria-label="model-type"
//             name="model-type"
//             value={modelType}
//             onChange={(e) => setModelType(e.target.value)}
//             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}
//           >
//             <FormControlLabel
//               value="pretrained"
//               control={<Radio />}
//               label={
//                 <Card variant="outlined" sx={{ width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <CardContent>
//                     <Storage fontSize="large" color="primary" />
//                     <Typography variant="subtitle1">Pretrained Model</Typography>
//                   </CardContent>
//                 </Card>
//               }
//               labelPlacement="bottom"
//             />
//             <FormControlLabel
//               value="custom"
//               control={<Radio />}
//               label={
//                 <Card variant="outlined" sx={{ width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <CardContent>
//                     <Code fontSize="large" color="secondary" />
//                     <Typography variant="subtitle1">Custom Model</Typography>
//                   </CardContent>
//                 </Card>
//               }
//               labelPlacement="bottom"
//             />
//           </RadioGroup>
//         );
//       case 1:
//         return (
//           <Grid container spacing={2} justifyContent="center">
//             {models.map(model => (
//               <Grid item key={model._id || model.name}>
//                 <Card 
//                   sx={{ 
//                     width: 200, 
//                     height: 100, 
//                     border: modelName === model.name ? `2px solid ${theme.palette.primary.main}` : 'none'
//                   }}
//                 >
//                   <CardActionArea 
//                     onClick={() => setModelName(model.name)}
//                     sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
//                   >
//                     <CardContent>
//                       <Typography variant="subtitle1" align="center">
//                         {model.name}
//                       </Typography>
//                     </CardContent>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         );
//       case 2:
//         return (
//           <TextField
//             label="IP Address"
//             value={ipAddress}
//             onChange={(e) => setIpAddress(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//           />
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
//         <Typography variant="h4" gutterBottom align="center" color="primary">
//           Model Deployment
//         </Typography>
//         <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//         {message && (
//           <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
//             {message.text}
//           </Alert>
//         )}
//         <Box sx={{ mt: 2, mb: 1 }}>
//           {getStepContent(activeStep)}
//         </Box>
//         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//           <Button
//             color="inherit"
//             disabled={activeStep === 0}
//             onClick={handleBack}
//             sx={{ mr: 1 }}
//           >
//             Back
//           </Button>
//           <Box sx={{ flex: '1 1 auto' }} />
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleExecute}
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
//             >
//               {loading ? 'Configuring...' : 'Configure'}
//             </Button>
//           ) : (
//             <Button variant="contained" onClick={handleNext} endIcon={<Settings />}>
//               Next
//             </Button>
//           )}
//         </Box>
//       </Paper>
//       {activeStep === steps.length && (
//         <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, bgcolor: theme.palette.success.light }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item>
//             <div className="App">
//       <VideoFeed serverUrl={serverUrl} />
//     </div>
//               <Check fontSize="large" color="success" />
//             </Grid>
//             <Grid item xs>
//               <Typography variant="h6" color="text.primary">
//                 Deployment Successful
//               </Typography>
//               <Typography variant="body1" color="text.secondary">
//                 Your model has been successfully deployed.
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>
//       )}
//     </Container>
//   );
// }

// export default RunScript;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Radio,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import { Settings, CloudUpload, Check, Storage, Code } from '@mui/icons-material';
import axios from 'axios';
import VideoFeed from './VideoFeed';

const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
});

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
  const theme = useTheme();
  const serverUrl = 'http://localhost:5007';

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
    setShowVideo(false); // Hide video when going back
  };

  const handleExecute = async () => {
    if (!modelName || !ipAddress) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    // Show video feed immediately
    setShowVideo(true);
    
    // First refresh
    setVideoRefreshCount(count => count + 1);
    
    // Second refresh after 1 second
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
          <RadioGroup
            aria-label="model-type"
            name="model-type"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}
          >
            <FormControlLabel
              value="pretrained"
              control={<Radio />}
              label={
                <Card variant="outlined" sx={{ width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardContent>
                    <Storage fontSize="large" color="primary" />
                    <Typography variant="subtitle1">Pretrained Model</Typography>
                  </CardContent>
                </Card>
              }
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label={
                <Card variant="outlined" sx={{ width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardContent>
                    <Code fontSize="large" color="secondary" />
                    <Typography variant="subtitle1">Custom Model</Typography>
                  </CardContent>
                </Card>
              }
              labelPlacement="bottom"
            />
          </RadioGroup>
        );
      case 1:
        return (
          <Grid container spacing={2} justifyContent="center">
            {models.map(model => (
              <Grid item key={model._id || model.name}>
                <Card 
                  sx={{ 
                    width: 200, 
                    height: 100, 
                    border: modelName === model.name ? `2px solid ${theme.palette.primary.main}` : 'none'
                  }}
                >
                  <CardActionArea 
                    onClick={() => setModelName(model.name)}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" align="center">
                        {model.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Box>
            <TextField
              label="IP Address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Box sx={{ mt: 4, display: showVideo ? 'block' : 'none' }}>
              <Typography variant="h6" gutterBottom>
                Live Video Feed
              </Typography>
              <VideoFeed 
                key={`video-feed-${videoRefreshCount}`} 
                serverUrl={serverUrl} 
              />
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
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
          <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <Box sx={{ mt: 2, mb: 1 }}>
          {getStepContent(activeStep)}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleExecute}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
            >
              {loading ? 'Configuring...' : 'Configure'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} endIcon={<Settings />}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
      {activeStep === steps.length && (
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, bgcolor: theme.palette.success.light }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Check fontSize="large" color="success" />
            </Grid>
            <Grid item xs>
              <Typography variant="h6" color="text.primary">
                Deployment Successful
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your model has been successfully deployed.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default RunScript;