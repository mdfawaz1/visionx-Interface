import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
  Avatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack
} from '@mui/material';
import {
  Settings,
  CloudUpload,
  Check,
  Storage as StorageIcon,
  Code,
  Memory,
  Layers,
  RocketLaunch,
  Assistant,
  Lightbulb,
  Celebration,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowUp,
  KeyboardArrowDown,
  SmartToy,
  Close,
  SmartToyOutlined,
  SupportAgent,
  Psychology,
  PsychologyAlt,
  AutoAwesome,
  RocketLaunchOutlined,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import api from '../api';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const gradientBg = 'linear-gradient(135deg, #0066FF, #6B37FF, #FF2E93)';
const softGradientBg = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(107, 55, 255, 0.1), rgba(255, 46, 147, 0.1))';

const theme = createTheme({
  palette: {
    primary: { main: primaryColor },
    secondary: { main: secondaryColor },
    background: { default: '#f8fafc' },
  },
  shape: { borderRadius: 16 },
});

const AIMessages = {
  0: {
    title: "Hey there! 👋 Ready to Deploy?",
    message: "I'm your AI deployment assistant. Let's get your model up and running! First, we need to decide which type of model you want to deploy. I'll help you make the best choice.",
    icon: <Assistant sx={{ fontSize: 30, color: '#00f2fe' }} />,
    tips: [
      {
        title: "Pre-trained Models",
        description: "Perfect for quick deployment and standard use cases. These models are already optimized and tested.",
        icon: "🚀"
      },
      {
        title: "Custom Models",
        description: "Ideal when you need specialized functionality. These are the models you've trained for specific needs.",
        icon: "⚙️"
      },
      {
        title: "Pro Tip",
        description: "Consider your hardware requirements and deployment environment before selecting.",
        icon: "💡"
      }
    ]
  },
  1: {
    title: "Choose Wisely! 🎯",
    message: "Now comes the exciting part! Each model has its unique strengths. I'll help you understand what makes each one special.",
    icon: <Lightbulb sx={{ fontSize: 30, color: '#7b61ff' }} />,
    tips: [
      {
        title: "Performance",
        description: "Look for models with high accuracy scores and low latency for real-time applications.",
        icon: "📊"
      },
      {
        title: "Compatibility",
        description: "Ensure your chosen model supports your target hardware and runtime environment.",
        icon: "🔧"
      },
      {
        title: "Resource Usage",
        description: "Consider memory requirements and processing power needed for optimal performance.",
        icon: "💪"
      }
    ]
  },
  2: {
    title: "Almost There! 🌟",
    message: "Now, enter the IP address where you want to deploy the model. This is typically the address of your edge device or server.",
    icon: <RocketLaunch sx={{ fontSize: 30, color: '#2196F3' }} />,
    tips: [
      "Make sure the device is on the same network",
      "Verify the IP address is correct and accessible"
    ]
  },
  3: {
    title: "Congratulations! 🎉",
    message: "Your model has been successfully deployed and is ready to use. You can now start processing data with your AI model.",
    icon: <Celebration sx={{ fontSize: 30, color: '#FF4081' }} />,
    tips: [
      "Monitor your model's performance",
      "Check the deployment logs for any important information"
    ]
  }
};

const AIAssistant = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        right: 30,
        bottom: 30,
        zIndex: 1100,
      }}
    >
      {!isExpanded ? (
        // AI Button
        <Paper
          elevation={4}
          sx={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: gradientBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          onClick={() => setIsExpanded(true)}
        >
          <AutoAwesome sx={{ 
            fontSize: 32, 
            color: '#fff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} />
        </Paper>
      ) : (
        // Expanded AI Assistant
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <Paper
            elevation={4}
            sx={{
              width: 380,
              background: 'rgba(17, 25, 40, 0.95)',
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                background: gradientBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    width: 40,
                    height: 40,
                  }}
                >
                  <AutoAwesome sx={{ color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    AI Assistant
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Here to help you deploy
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => setIsExpanded(false)}
                sx={{ color: '#fff' }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2.5 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {AIMessages[step].title}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {AIMessages[step].message}
              </Typography>

              {/* Tips */}
              <Box sx={{ mt: 3 }}>
                {AIMessages[step].tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        mb: 1.5,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem' }}>
                          {tip.icon}
                        </Typography>
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: '#fff',
                              fontWeight: 600,
                              mb: 0.5
                            }}
                          >
                            {tip.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              lineHeight: 1.4,
                              display: 'block'
                            }}
                          >
                            {tip.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Paper>
        </motion.div>
      )}
    </motion.div>
  );
};

function RunScript() {
  const [activeStep, setActiveStep] = useState(0);
  const [ipAddress, setIpAddress] = useState('');
  const [modelType, setModelType] = useState('pretrained');
  const [modelName, setModelName] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);

  const fetchModels = useCallback(() => {
    const endpoint = modelType === 'pretrained' ? '/models' : '/custom-models';
    api.get(endpoint)
      .then(response => setModels(response.data))
      .catch(error => console.error(`Error fetching ${modelType} models:`, error));
  }, [modelType]);

  useEffect(() => {
    fetchModels();
  }, [modelType, fetchModels]);

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleExecute = async () => {
    if (!modelName || !ipAddress) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = modelType === 'pretrained' ? '/streams/run-script' : `/custom-model/${modelName}/run-script`;
      const payload = modelType === 'pretrained' ? { ipAddress, modelName } : { ipAddress };
      await api.post(endpoint, payload);
      setDeploymentStatus('success');
      handleNext();
    } catch (error) {
      console.error('Error:', error);
      setDeploymentStatus('error');
      alert('Error deploying model');
    } finally {
      setLoading(false);
    }
  };

  const ModelTypeSelection = () => (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={10}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: softGradientBg,
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: gradientBg,
            }} 
          />
          
          <RadioGroup
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            sx={{ width: '100%' }}
          >
            <Grid container spacing={3}>
              {[
                { 
                  value: 'pretrained', 
                  label: 'Pre-trained Model', 
                  icon: <StorageIcon />,
                  description: 'Ready-to-use models optimized for performance'
                },
                { 
                  value: 'custom', 
                  label: 'Custom Model', 
                  icon: <Code />,
                  description: 'Your specialized models trained for specific needs'
                }
              ].map((option) => (
                <Grid item xs={12} md={6} key={option.value}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      background: modelType === option.value ? gradientBg : '#fff',
                      borderRadius: '15px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0, 102, 255, 0.1)',
                      height: '100%',
                      transform: modelType === option.value ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: modelType === option.value 
                        ? '0 10px 20px rgba(0, 102, 255, 0.2)' 
                        : '0 4px 6px rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 10px 20px rgba(0, 102, 255, 0.2)',
                      }
                    }}
                    onClick={() => setModelType(option.value)}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        value={option.value}
                        control={
                          <Radio 
                            sx={{ 
                              color: modelType === option.value ? '#fff' : primaryColor,
                              '&.Mui-checked': {
                                color: '#fff'
                              }
                            }} 
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {React.cloneElement(option.icon, { 
                              sx: { 
                                color: modelType === option.value ? '#fff' : primaryColor, 
                                fontSize: 30 
                              } 
                            })}
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: modelType === option.value ? '#fff' : '#0F172A',
                                fontWeight: 600 
                              }}
                            >
                              {option.label}
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: modelType === option.value ? 'rgba(255,255,255,0.8)' : '#64748B',
                          ml: 4
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </Paper>
      </Grid>
    </Grid>
  );

  const ModelSelection = () => (
    <Grid 
      container 
      spacing={3} 
      sx={{ 
        maxWidth: '100%',
        margin: '0 auto',
        px: 2
      }}
    >
      {models.map((model) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          key={model._id || model.name}
          sx={{ width: '100%' }}
        >
          <Paper
            elevation={0}
            onClick={() => setModelName(model.name)}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              background: modelName === model.name ? gradientBg : '#fff',
              borderRadius: '20px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(0, 102, 255, 0.1)',
              transform: modelName === model.name ? 'scale(1.02)' : 'scale(1)',
              boxShadow: modelName === model.name 
                ? '0 10px 20px rgba(0, 102, 255, 0.2)' 
                : '0 4px 6px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 10px 20px rgba(0, 102, 255, 0.2)',
              },
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 2
            }}>
              <Memory sx={{ 
                fontSize: 40, 
                mb: 2,
                color: modelName === model.name ? '#fff' : primaryColor 
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: modelName === model.name ? '#fff' : '#0F172A',
                  fontWeight: 600,
                  wordBreak: 'break-word'
                }}
              >
                {model.name}
              </Typography>
            </Box>

            {modelName === model.name && (
              <Accordion
                elevation={0}
                sx={{
                  background: 'transparent',
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    minHeight: 'auto',
                    '&.Mui-expanded': { minHeight: 'auto' }
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                  sx={{ 
                    padding: '0 8px',
                    '& .MuiAccordionSummary-content': { margin: '8px 0' }
                  }}
                >
                  <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                    View Model Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 8px 16px' }}>
                  <Stack spacing={1.5}>
                    {modelType === 'pretrained' ? (
                      // Pretrained model insights
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpeedIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Inference Speed: Fast
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MemoryIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Model Size: {model.size || '25MB'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimelineIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Accuracy: {model.accuracy || '95%'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Supported Tasks: Object Detection, Tracking
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      // Custom model insights
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Use Case: {model.useCase}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimelineIcon sx={{ color: '#fff', fontSize: 20 }} />
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Version: {model.currentVersion || '1.0'}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          <Chip 
                            label="Custom Training" 
                            size="small"
                            sx={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              color: '#fff',
                              fontSize: '0.8rem'
                            }} 
                          />
                          <Chip 
                            label="Specialized" 
                            size="small"
                            sx={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              color: '#fff',
                              fontSize: '0.8rem'
                            }} 
                          />
                        </Stack>
                      </>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const IPConfiguration = () => (
    <Fade in={true}>
      <Box sx={{ 
        maxWidth: 500, 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2 
      }}>
        <Typography variant="h6" sx={{ color: primaryColor, mb: 2 }}>
          Configure Device
        </Typography>
        
        <TextField
          label="Device IP Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Enter IP Address"
          InputProps={{
            startAdornment: <Layers sx={{ mr: 1, color: primaryColor }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: '#fff',
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
              },
            },
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Deployment Summary
          </Typography>
          <Paper sx={{ p: 2, background: softGradientBg, borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon sx={{ color: primaryColor }} />
                <Typography>Model Type: {modelType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Memory sx={{ color: primaryColor }} />
                <Typography>Model Name: {modelName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layers sx={{ color: primaryColor }} />
                <Typography>Device List: {ipAddress}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );

  const SuccessView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: softGradientBg,
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {deploymentStatus === 'success' ? (
          <>
            <Check sx={{ fontSize: 60, color: primaryColor, mb: 2 }} />
            <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 600, mb: 1 }}>
              Deployment Successful!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
              Your model has been successfully deployed and is now operational.
            </Typography>
          </>
        ) : (
          <>
            <Close sx={{ fontSize: 60, color: secondaryColor, mb: 2 }} />
            <Typography variant="h5" sx={{ color: secondaryColor, fontWeight: 600, mb: 1 }}>
              Deployment Failed
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
              Please try again or contact support.
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          startIcon={<RocketLaunch />}
          sx={{
            background: gradientBg,
            color: 'white',
            '&:hover': {
              background: gradientBg,
              filter: 'brightness(1.1)',
            },
          }}
        >
          Start New Deployment
        </Button>
      </Paper>
    </motion.div>
  );

  const steps = [
    { title: 'Select Model Type', component: <ModelTypeSelection /> },
    { title: 'Choose Model', component: <ModelSelection /> },
    { title: 'Configure Devices', component: <IPConfiguration /> },
    { title: 'Success', component: <SuccessView /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <AIAssistant step={activeStep} />
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            p: 4,
            borderRadius: '30px',
            background: '#ffffff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            marginTop: '-5.7rem',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: gradientBg,
              borderRadius: '30px 30px 0 0',
            }
          }}
        >
          {/* Header section with improved styling */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 6
          }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: gradientBg,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: primaryColor }} />
              Model Deployment
            </Typography>
            
            {/* Add deployment progress indicator */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: softGradientBg,
              padding: '8px 16px',
              borderRadius: '12px',
            }}>
              <Typography sx={{ color: primaryColor, fontWeight: 600 }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
              <Box sx={{
                width: 100,
                height: 4,
                background: 'rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <Box sx={{
                  width: `${((activeStep + 1) / steps.length) * 100}%`,
                  height: '100%',
                  background: gradientBg,
                  transition: 'width 0.3s ease-in-out',
                }} />
              </Box>
            </Box>
          </Box>

          {/* Steps navigation */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: softGradientBg,
              borderRadius: '3px',
            },
          }}>
            {steps.map((step, index) => (
              <Paper
                key={step.title}
                elevation={0}
                sx={{
                  p: 2,
                  minWidth: 150,
                  textAlign: 'center',
                  background: index === activeStep ? gradientBg : softGradientBg,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography sx={{ 
                  color: index === activeStep ? '#fff' : '#64748B',
                  fontWeight: 600,
                }}>
                  {step.title}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Content area with improved styling */}
          <Box sx={{ 
            minHeight: 400, 
            mb: 4,
            background: softGradientBg,
            borderRadius: '20px',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  padding: '1px'
                }}
              >
                {steps[activeStep].component}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Navigation buttons with improved styling */}
          {activeStep < steps.length - 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 4,
              pt: 4,
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<Settings />}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: secondaryColor,
                    background: 'rgba(0, 102, 255, 0.05)',
                  },
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === 2 ? handleExecute : handleNext}
                disabled={loading}
                sx={{
                  background: gradientBg,
                  color: 'white',
                  px: 4,
                  py: 1,
                  '&:hover': {
                    background: gradientBg,
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {activeStep === 2 ? 'Deploy' : 'Next'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default RunScript;