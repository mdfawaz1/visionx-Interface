// import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';
// import { motion } from 'framer-motion';
// import {
//   Button,
//   Card,
//   CardContent,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   CircularProgress,
//   Alert,
//   Box,
//   Container,
//   Grid,
//   Fade,
//   Paper,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
//   Grow,
//   useTheme,
// } from '@mui/material';
// import {
//   Settings,
//   CloudUpload,
//   Check,
//   Storage as StorageIcon,
//   Code,
//   Layers,
//   Speed,
//   Refresh,
//   Memory ,
// } from '@mui/icons-material';
// import VideoFeed from './VideoFeed';
// import api from '../api'
// // const api = axios.create({
// //   baseURL: 'http://localhost:26000/api/v1',
// // });

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#2196f3',
//     },
//     secondary: {
//       main: '#ff4081',
//     },
//     background: {
//       default: '#f5f5f5',
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
// });

// const MotionPaper = motion(Paper);

// function RunScript() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [ipAddress, setIpAddress] = useState('');
//   const [modelType, setModelType] = useState('pretrained');
//   const [modelName, setModelName] = useState('');
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [showVideo, setShowVideo] = useState(false);
//   const [videoRefreshCount, setVideoRefreshCount] = useState(0);
//   const serverUrl = 'http://localhost:5007';
//   const theme = useTheme();

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
//     setShowVideo(false);
//   };

//   const handleExecute = async () => {
//     if (!modelName || !ipAddress) {
//       setMessage({ type: 'error', text: 'Please fill in all fields.' });
//       return;
//     }

//     setShowVideo(true);

//     setVideoRefreshCount(count => count + 1);
//     setTimeout(() => {
//       setVideoRefreshCount(count => count + 1);
//     }, 5000);

//     setLoading(true);

//     try {
//       const endpoint = modelType === 'pretrained' ? '/streams/run-script' : `/custom-model/${modelName}/run-script`;
//       const payload = modelType === 'pretrained' ? { ipAddress, modelName } : { ipAddress };

//       const response = await api.post(endpoint, payload);
//       setMessage({ type: 'success', text: response.data.message });
//       handleNext();
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error executing script' });
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const steps = ['Select Model Type', 'Choose Model', 'Configure IP'];
//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Grid container spacing={4} justifyContent="center">
//             <Grid item xs={12} md={6}>
//               <Grow in={true} timeout={1000}>
//                 <Paper
//                   elevation={6}
//                   sx={{
//                     p: 4,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     bgcolor: 'linear-gradient(135deg, #e0f7fa 30%, #ffffff 100%)',
//                     borderRadius: 4,
//                     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
//                     transition: 'transform 0.3s, box-shadow 0.3s',
//                     '&:hover': {
//                       transform: 'scale(1.05)',
//                       boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.25)',
//                     },
//                   }}
//                 >
//                   <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', mb: 2 }}>
//                     Select Model Type
//                   </Typography>
//                   <RadioGroup
//                     aria-label="model-type"
//                     name="model-type"
//                     value={modelType}
//                     onChange={(e) => setModelType(e.target.value)}
//                     sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
//                   >
//                     <FormControlLabel
//                       value="pretrained"
//                       control={<Radio sx={{ color: 'primary.main' }} />}
//                       label={
//                         <Box display="flex" alignItems="center">
//                           <StorageIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
//                           <Typography variant="h6">Pretrained Model</Typography>
//                         </Box>
//                       }
//                     />
//                     <FormControlLabel
//                       value="custom"
//                       control={<Radio sx={{ color: 'secondary.main' }} />}
//                       label={
//                         <Box display="flex" alignItems="center">
//                           <Code fontSize="large" color="secondary" sx={{ mr: 1 }} />
//                           <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: '500' }}>
//                             Custom Model
//                           </Typography>
//                         </Box>
//                       }
//                     />
//                   </RadioGroup>
//                 </Paper>
//               </Grow>
//             </Grid>
//           </Grid>
//         );
//       case 1:
//         return (
//           <Grid container spacing={3}>
//             {models.map((model, index) => (
//               <Grid item xs={12} sm={6} md={4} key={model._id || model.name}>
//                 <Grow in={true} timeout={500 + index * 100}>
//                   <MotionPaper
//                     elevation={3}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.98 }}
//                     sx={{
//                       p: 3,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       cursor: 'pointer',
//                       borderRadius: 3,
//                       border: modelName === model.name ? `2px solid ${theme.palette.primary.main}` : 'none',
//                       bgcolor: modelName !== model.name ? 'background.paper' : 'primary.light',
//                       '&:hover': {
//                         bgcolor: 'rgba(33, 150, 243, 0.15)',
//                       },
//                     }}
//                     onClick={() => setModelName(model.name)}
//                   >
//                     <Memory color="primary" sx={{ fontSize: 48, mb: 1 }} />
//                     <Typography variant="h6" align="center">
//                       {model.name}
//                     </Typography>
//                   </MotionPaper>
//                 </Grow>
//               </Grid>
//             ))}
//           </Grid>
//         );
//       case 2:
//         return (
//           <Fade in={true} timeout={1000}>
//             <Box>
//               <TextField
//                 label="IP Address"
//                 value={ipAddress}
//                 onChange={(e) => setIpAddress(e.target.value)}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 sx={{
//                   backgroundColor: 'background.paper',
//                   borderRadius: 1,
//                 }}
//                 InputProps={{
//                   startAdornment: <Layers color="action" sx={{ mr: 1 }} />,
//                 }}
//               />
//             </Box>
//           </Fade>
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
//           <Typography variant="h4" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
//             Model Deployment
//           </Typography>

//           <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {message && (
//             <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }} variant="filled">
//               {message.text}
//             </Alert>
//           )}

//           <Box sx={{ mb: 4, minHeight: 300 }}>
//             {getStepContent(activeStep)}
//           </Box>

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
//             <Button
//               variant="outlined"
//               color="primary"
//               disabled={activeStep === 0}
//               onClick={handleBack}
//               startIcon={<Settings />}
//             >
//               Back
//             </Button>
//             {activeStep === steps.length - 1 ? (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleExecute}
//                 disabled={loading}
//                 startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
//                 sx={{ minWidth: 150 }}
//               >
//                 {loading ? 'Configuring...' : 'Configure'}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleNext}
//                 endIcon={<Speed />}
//                 sx={{ minWidth: 150 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </Paper>

//         {activeStep === steps.length && (
//           <>
//             <Grow in={true} timeout={1000}>
//               <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: 2, backgroundColor: '#e8f5e9' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Check sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
//                   <Box>
//                     <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
//                       Deployment Successful
//                     </Typography>
//                     <Typography variant="body1" sx={{ color: '#388e3c' }}>
//                       Your model has been successfully deployed and is now operational.
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Paper>
//             </Grow>
            
//             {showVideo && (
//               <Grow in={true} timeout={1000}>
//                 <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
//                   <Typography variant="h6" gutterBottom>
//                     Live Video Feed
//                   </Typography>
//                   <Box
//                     sx={{
//                       width: '100%',
//                       aspectRatio: '16/9',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       borderRadius: 2,
//                       bgcolor: '#e0e0e0',
//                     }}
//                   >
//                     <VideoFeed key={`video-feed-${videoRefreshCount}`} serverUrl={serverUrl} />
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<Refresh />}
//                       onClick={() => setVideoRefreshCount((count) => count + 1)}
//                       sx={{
//                         position: 'absolute',
//                         bottom: 16,
//                         right: 16,
//                         boxShadow: 3,
//                       }}
//                     >
//                       Refresh Feed
//                     </Button>
//                   </Box>
//                 </Paper>
//               </Grow>
//             )}
//           </>
//         )}
//       </Container>
//     </ThemeProvider>
//   );
// }

// export default RunScript;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import { FaRobot, FaCog, FaArrowLeft, FaServer, FaNetworkWired, FaRocket } from 'react-icons/fa';
import api from '../api';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: #0f0f1f;
    color: #ffffff;
  }
`;

const Container = styled(motion.div)`
  min-height: 100vh;
  width: 90vw;
  display: flex;
  margin-top:-5rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  background: #0f0f1f;
  color: #ffffff;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const PipelineContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 3rem;
  position: relative;
`;

const BuildingBlock = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
  }
`;

const BlockIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #00ffff;
`;

const BlockTitle = styled.div`
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  color: #ffffff;
`;

const Connector = styled(motion.div)`
  height: 4px;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  position: absolute;
  top: 50%;
  left: 70px;
  right: 70px;
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
`;

const ContentArea = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 1000px;
  min-height: 300px;
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.5);

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 255, 0.7);
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }
`;

const Input = styled(motion.input)`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #ff00ff;
  border-radius: 5px;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    background: rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ProgressBar = styled(motion.div)`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin-top: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
`;

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.step === 0 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))'};
  gap: ${props => props.step === 0 ? '4rem' : '2rem'};
  width: 100%;
  justify-items: center;
`;

const ModelCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.3);
  width: 200px;
  height: 200px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(31, 38, 135, 0.5);
  }
`;

const ModelIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #00ffff;
`;

const ModelName = styled.div`
  font-size: 1.2rem;
  text-align: center;
  font-weight: 500;
  color: #ffffff;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #ffffff;
`;

const SummaryIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #00ffff;
`;

export default function Component() {
  const [step, setStep] = useState(0);
  const [modelType, setModelType] = useState('');
  const [modelName, setModelName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);

  useEffect(() => {
    if (modelType) {
      fetchModels();
    }
  }, [modelType]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await api.get(modelType === 'pretrained' ? '/models' : '/custom-models');
      setModels(response.data);
      setStep(1);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!modelName || !ipAddress) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = modelType === 'pretrained' ? '/streams/run-script' : `/custom-model/${modelName}/run-script`;
      const payload = modelType === 'pretrained' ? { ipAddress, modelName } : { ipAddress };

      const response = await api.post(endpoint, payload);
      setDeploymentStatus('success');
      setStep(4);
    } catch (error) {
      console.error('Error:', error);
      setDeploymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (name) => {
    setModelName(name);
    setStep(2);
  };

  const handleIpSubmit = () => {
    if (ipAddress) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(Math.max(0, step - 1));
    if (step === 1) {
      setModelType('');
    } else if (step === 2) {
      setModelName('');
    } else if (step === 3) {
      setIpAddress('');
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <ModelGrid step={0}>
            <ModelCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModelType('pretrained')}>
              <ModelIcon><FaRobot /></ModelIcon>
              <ModelName>Pretrained Models</ModelName>
            </ModelCard>
            <ModelCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModelType('custom')}>
              <ModelIcon><FaCog /></ModelIcon>
              <ModelName>Custom Models</ModelName>
            </ModelCard>
          </ModelGrid>
        );
      case 1:
        return (
          <ModelGrid step={1}>
            {models.map((model) => (
              <ModelCard key={model._id || model.name} onClick={() => handleModelSelect(model.name)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ModelIcon>{modelType === 'pretrained' ? <FaRobot /> : <FaCog />}</ModelIcon>
                <ModelName>{model.name}</ModelName>
              </ModelCard>
            ))}
          </ModelGrid>
        );
      case 2:
        return (
          <div>
            <Input
              type="text"
              placeholder="Enter IP Address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleIpSubmit()}
            />
            <Button onClick={handleIpSubmit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Next
            </Button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Deployment Summary</h2>
            <SummaryItem>
              <SummaryIcon><FaServer /></SummaryIcon>
              <span>Model Type: {modelType}</span>
            </SummaryItem>
            <SummaryItem>
              <SummaryIcon><FaCog /></SummaryIcon>
              <span>Model Name: {modelName}</span>
            </SummaryItem>
            <SummaryItem>
              <SummaryIcon><FaNetworkWired /></SummaryIcon>
              <span>IP Address: {ipAddress}</span>
            </SummaryItem>
            <Button onClick={handleDeploy} disabled={loading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {loading ? 'Deploying...' : 'Deploy'}
            </Button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 style={{ color: deploymentStatus === 'success' ? '#00ffff' : '#ff6b6b', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {deploymentStatus === 'success' ? 'Deployment Successful!' : 'Deployment Failed'}
            </h2>
            <p style={{ color: '#ffffff', marginBottom: '1.5rem' }}>
              {deploymentStatus === 'success' ? 'Your model is now operational.' : 'Please try again or contact support.'}
            </p>
            <Button onClick={() => window.location.reload()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaRocket style={{ marginRight: '0.5rem' }} /> Start New Deployment
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Title initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100 }}>
           Model Deployment Pipeline
        </Title>

        <PipelineContainer>
          <Connector style={{ scaleX: step / 3 }} />
          {[
            { title: 'Select Category', icon: <FaServer /> },
            { title: 'Choose Model', icon: <FaCog /> },
            { title: 'Configure Streams', icon: <FaNetworkWired /> },
            { title:  'Deploy', icon: <FaRocket /> }
          ].map(({ title, icon }, index) => (
            <BuildingBlock
              key={title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: step >= index ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: step >= index ? '0 0 30px rgba(0, 255, 255, 0.5)' : 'none',
              }}
            >
              <BlockIcon>{icon}</BlockIcon>
              <BlockTitle>{title}</BlockTitle>
            </BuildingBlock>
          ))}
        </PipelineContainer>

        <ContentArea>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
          {step > 0 && (
            <BackButton onClick={handleBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Back
            </BackButton>
          )}
        </ContentArea>

        <ProgressBar>
          <ProgressFill style={{ width: `${(step / 3) * 100}%` }} />
        </ProgressBar>
      </Container>
    </>
  );
}