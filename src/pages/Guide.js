import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Fade,
  Zoom,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Security as SecurityIcon,
  Dashboard as DashboardIcon,
  Psychology as PsychologyIcon,
  RocketLaunch as RocketLaunchIcon,
  Science as ScienceIcon,
  Architecture as ArchitectureIcon,
  MovieFilter as MovieFilterIcon,
  SmartDisplay as SmartDisplayIcon,
  MonitorHeart as MonitorHeartIcon,
  Analytics as AnalyticsIcon,
  Videocam as VideocamIcon,
  TextSnippet as TextSnippetIcon,
  ExpandMore as ExpandMoreIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon2,
  Computer as ComputerIcon,
  Camera as CameraIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  CloudUpload as CloudUploadIcon,
  Devices as DevicesIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
  PsychologyAlt as PsychologyAltIcon,
  SmartToy as SmartToyIcon,
  AutoFixHigh as AutoFixHighIcon,
  TrendingUp,
  DatasetOutlined,
  ModelTraining,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Guide() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState('panel1');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Guide sections
  const guideSections = [
    {
      id: 'panel1',
      title: 'Getting Started',
      icon: <LoginIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Welcome to VisionX
          </Typography>
          <Typography paragraph>
            VisionX is an advanced security monitoring system that helps you monitor and analyze video feeds using AI models.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Login Credentials
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Access" 
                secondary="Username: admin | Password: admin123" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="User Access" 
                secondary="Username: user | Password: user123" 
              />
            </ListItem>
          </List>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Key Features
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SecurityIcon color="primary" sx={{ mr: 1 }} />
                    Security Monitoring
                  </Typography>
                  <Typography variant="body2">
                    Real-time video monitoring with AI-powered detection and analysis.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                    AI Models
                  </Typography>
                  <Typography variant="body2">
                    Pre-trained and custom AI models for various detection tasks.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <MonitorHeartIcon color="primary" sx={{ mr: 1 }} />
                    Live Monitoring
                  </Typography>
                  <Typography variant="body2">
                    Real-time monitoring of video feeds with instant alerts.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                    Analytics
                  </Typography>
                  <Typography variant="body2">
                    Detailed analytics and reporting on security events.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'panel2',
      title: 'Admin Features',
      icon: <SettingsIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography paragraph>
            As an administrator, you have access to all features of the VisionX system.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Available Modules
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <DashboardIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Home Dashboard" 
                secondary="Overview of system status and recent activities" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PsychologyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Models" 
                secondary="Manage pre-trained AI models" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <RocketLaunchIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Deployment" 
                secondary="Deploy models to devices" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ScienceIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Train Model" 
                secondary="Train custom AI models" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArchitectureIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Custom Models" 
                secondary="Manage your custom trained models" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MovieFilterIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Infer Models Video" 
                secondary="Test pre-trained models on video" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SmartDisplayIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Infer Custom Model Video" 
                secondary="Test custom models on video" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MonitorHeartIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Live Monitor" 
                secondary="Monitor live video feeds" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AnalyticsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Forecasting" 
                secondary="Predict future security events" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VideocamIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Device Management" 
                secondary="Manage connected cameras and devices" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TextSnippetIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Log Viewer" 
                secondary="View system logs and events" 
              />
            </ListItem>
          </List>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Getting Started as Admin
          </Typography>
          <Typography paragraph>
            1. Log in with your admin credentials
          </Typography>
          <Typography paragraph>
            2. Start by exploring the Home dashboard to get an overview
          </Typography>
          <Typography paragraph>
            3. Check the Models section to see available pre-trained models
          </Typography>
          <Typography paragraph>
            4. Set up devices in the Device Management section
          </Typography>
          <Typography paragraph>
            5. Configure Live Monitor to start monitoring your cameras
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => handleNavigate('/')}
            sx={{ mt: 2 }}
          >
            Go to Admin Dashboard
          </Button>
        </Box>
      ),
    },
    {
      id: 'panel3',
      title: 'User Features',
      icon: <PersonIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            User Dashboard
          </Typography>
          <Typography paragraph>
            As a regular user, you have access to the Live Monitor feature to view and analyze video feeds.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Live Monitor
          </Typography>
          <Typography paragraph>
            The Live Monitor is your main interface for viewing and analyzing video feeds in real-time.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CameraIcon color="primary" sx={{ mr: 1 }} />
                    Camera Feeds
                  </Typography>
                  <Typography variant="body2">
                    View live feeds from all connected cameras. You can switch between different cameras and adjust view settings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                    AI Detection
                  </Typography>
                  <Typography variant="body2">
                    AI models automatically detect and highlight objects, people, or events of interest in the video feeds.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TextSnippetIcon color="primary" sx={{ mr: 1 }} />
                    Event Logs
                  </Typography>
                  <Typography variant="body2">
                    View a log of all detected events, with timestamps and details about each detection.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                    Analytics
                  </Typography>
                  <Typography variant="body2">
                    View analytics and statistics about detected events, with charts and reports.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Getting Started as User
          </Typography>
          <Typography paragraph>
            1. Log in with your user credentials
          </Typography>
          <Typography paragraph>
            2. You will be automatically directed to the Live Monitor
          </Typography>
          <Typography paragraph>
            3. Select a camera feed to view
          </Typography>
          <Typography paragraph>
            4. Monitor the feed for any detected events
          </Typography>
          <Typography paragraph>
            5. Check the event logs for a history of detections
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => handleNavigate('/live-monitor')}
            sx={{ mt: 2 }}
          >
            Go to Live Monitor
          </Button>
        </Box>
      ),
    },
    {
      id: 'panel4',
      title: 'AI Models & Deployment',
      icon: <PsychologyAltIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Understanding AI Models in VisionX
          </Typography>
          <Typography paragraph>
            VisionX offers two types of AI models: pre-trained models and custom models. Each has its own advantages and use cases.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StorageIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Pre-trained Models
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Pre-trained models are AI models that have already been trained on large datasets and are ready to use immediately.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Advantages:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Ready to use immediately" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Optimized for performance" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Perfect for standard security tasks" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="No training required" />
                    </ListItem>
                  </List>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Common Use Cases:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label="Person Detection" size="small" color="primary" variant="outlined" />
                    <Chip label="Vehicle Recognition" size="small" color="primary" variant="outlined" />
                    <Chip label="Object Tracking" size="small" color="primary" variant="outlined" />
                    <Chip label="Anomaly Detection" size="small" color="primary" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Custom Models
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Custom models are AI models that you've trained specifically for your unique requirements and use cases.
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Advantages:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Specialized for your specific needs" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Higher accuracy for your use case" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Can detect unique objects or behaviors" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Adapted to your specific environment" />
                    </ListItem>
                  </List>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Common Use Cases:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label="Company-specific Products" size="small" color="secondary" variant="outlined" />
                    <Chip label="Custom Security Protocols" size="small" color="secondary" variant="outlined" />
                    <Chip label="Specialized Equipment" size="small" color="secondary" variant="outlined" />
                    <Chip label="Unique Behavioral Patterns" size="small" color="secondary" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            How to Deploy Models
          </Typography>
          <Typography paragraph>
            The deployment process in VisionX is straightforward and guided through a step-by-step interface.
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mt: 2, 
              mb: 3, 
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
              Step-by-Step Deployment Guide
            </Typography>
            
            <Stepper orientation={isMobile ? "vertical" : "horizontal"} sx={{ mt: 2 }}>
              <Step active={true}>
                <StepLabel>Choose Model Type</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Select between pre-trained models (ready to use) or custom models (your specialized models).
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, mr: 1 }}>
                      <StorageIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" sx={{ mr: 2 }}>Pre-trained</Typography>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24, mr: 1 }}>
                      <CodeIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Custom</Typography>
                  </Box>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Select a Model</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Choose a specific model from the available options. Each model card displays performance metrics and supported tasks.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <MemoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ mr: 2 }}>Model Name</Typography>
                    <SpeedIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">Performance</Typography>
                  </Box>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Configure Devices</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Select which cameras will use this model. You can choose multiple devices for deployment.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <DevicesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">Select cameras to deploy the model to</Typography>
                  </Box>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Deploy and Monitor</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Click "Deploy" to start the deployment process. Once complete, the model will immediately start processing video feeds.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">Monitor performance through Live Monitor</Typography>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            Tips for Successful Deployment
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Choose the Right Model</AlertTitle>
                Consider your specific security needs when selecting between pre-trained and custom models.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Device Compatibility</AlertTitle>
                Ensure your devices meet the requirements for the model you're deploying.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Network Considerations</AlertTitle>
                Models require network connectivity to process video feeds effectively.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Performance Monitoring</AlertTitle>
                After deployment, monitor the model's performance through the Live Monitor section.
              </Alert>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<RocketLaunchIcon />}
              onClick={() => handleNavigate('/run-script')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Go to Deployment
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      id: 'panel5',
      title: 'Troubleshooting',
      icon: <HelpIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Common Issues and Solutions
          </Typography>
          
          <Accordion expanded={expandedAccordion === 'login'} onChange={handleAccordionChange('login')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Login Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Problem:</strong> Unable to log in with correct credentials
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Make sure you're using the correct username and password. For admin access, use "admin" and "admin123". For user access, use "user" and "user123".
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> Login page not loading
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Clear your browser cache and cookies, then try again. If the issue persists, contact your system administrator.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expandedAccordion === 'camera'} onChange={handleAccordionChange('camera')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Camera Feed Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Problem:</strong> Camera feed not displaying
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Check if the camera is properly connected and powered on. Verify network connectivity between the camera and the system.
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> Poor video quality
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Check your network bandwidth. You may need to adjust the video quality settings in the camera configuration.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expandedAccordion === 'ai'} onChange={handleAccordionChange('ai')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">AI Detection Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Problem:</strong> AI not detecting objects correctly
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Ensure the correct model is selected for your use case. You may need to adjust sensitivity settings or train a custom model for better accuracy.
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> False positives in detection
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Adjust the confidence threshold in the model settings. Higher thresholds will reduce false positives but may miss some detections.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expandedAccordion === 'deployment'} onChange={handleAccordionChange('deployment')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Model Deployment Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Problem:</strong> Model deployment fails
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Check if the selected devices are online and properly configured. Verify that the model is compatible with the selected devices.
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> Model performs poorly after deployment
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Consider using a different model or retraining your custom model with more diverse data. Check the device's processing capabilities.
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> Can't select devices for deployment
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Make sure you have configured devices in the Device Management section first. If no devices are available, you'll need to add them before deployment.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expandedAccordion === 'system'} onChange={handleAccordionChange('system')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">System Performance Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Problem:</strong> System running slowly
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Check the Log Viewer for any system errors. You may need to restart the application or contact your system administrator.
              </Typography>
              <Typography paragraph>
                <strong>Problem:</strong> Unable to access certain features
              </Typography>
              <Typography paragraph>
                <strong>Solution:</strong> Verify that you have the correct user role. Some features are only available to administrators.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Need More Help?
          </Typography>
          <Typography paragraph>
            If you're experiencing issues not covered in this guide, please contact your system administrator or the VisionX support team.
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ComputerIcon />}
              onClick={() => handleNavigate('/log-viewer')}
            >
              Check System Logs
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={() => handleNavigate('/device-management')}
            >
              Device Management
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      id: 'panel6',
      title: 'Data Forecasting',
      icon: <TrendingUp />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Data Forecasting in VisionX
          </Typography>
          <Typography paragraph>
            VisionX's forecasting module allows you to predict future security events based on historical data, helping you anticipate potential issues before they occur.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DatasetOutlined color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Data Sources
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Forecasting uses historical data from your security system to predict future trends:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Security event logs" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Detection metrics from AI models" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Traffic patterns and visitor counts" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="System performance metrics" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ModelTraining color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Forecasting Models
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Choose from several advanced forecasting algorithms:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Prophet" 
                        secondary="Best for data with seasonal patterns" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="ARIMA" 
                        secondary="Good for stationary time series data" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="LSTM" 
                        secondary="Neural networks for complex patterns" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="N-HITS" 
                        secondary="Advanced model for hierarchical time series" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            How to Use Forecasting
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mt: 2, 
              mb: 3, 
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <Stepper orientation={isMobile ? "vertical" : "horizontal"} sx={{ mt: 2 }}>
              <Step active={true}>
                <StepLabel>Select Data Source</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Choose which data source you want to analyze and forecast.
                  </Typography>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Choose Forecasting Model</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Select the appropriate model for your data type and forecasting needs.
                  </Typography>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Configure Settings</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Adjust forecasting period and model parameters for optimal results.
                  </Typography>
                </StepContent>
              </Step>
              
              <Step active={true}>
                <StepLabel>Train and View Results</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Generate forecasts and analyze trends in the interactive chart view.
                  </Typography>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Tips for Effective Forecasting
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Choose the Right Model</AlertTitle>
                Different models work better for different data patterns. Try multiple models to find the best fit.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Sufficient Historical Data</AlertTitle>
                Better forecasts require more historical data - ideally at least 2-3x the period you want to forecast.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Consider Seasonality</AlertTitle>
                Security events often follow daily, weekly or seasonal patterns that models can learn.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <AlertTitle>Balance Accuracy vs. Speed</AlertTitle>
                Use the preset configurations (Fast, Balanced, Accurate) to control model complexity.
              </Alert>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<TrendingUp />}
              onClick={() => handleNavigate('/forecasting')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Go to Forecasting
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  // Custom typography styles
  const typographyStyles = {
    tabLabel: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.3px',
    },
    sectionTitle: {
      fontFamily: '"Montserrat", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.5px',
      fontSize: '1.5rem',
      background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      display: 'inline-block',
      marginBottom: '1rem',
    },
    paragraph: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: 'rgba(0, 0, 0, 0.78)',
    },
    subtitle: {
      fontFamily: '"Montserrat", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.1rem',
      color: '#1976d2',
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
    },
    button: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.5px',
      textTransform: 'none',
    }
  };

  return (
    <Container maxWidth="xxl" sx={{ py: 4, mt: 1 , marginTop: '-100px', marginLeft: '-10px'}}>
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Redesigned horizontal tabs - no duplicate header */}
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "fullWidth"} 
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                '.MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
                }
              }}
            >
              {guideSections.map((section, index) => (
                <Tab 
                  key={section.id}
                  label={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      py: 1,
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: activeTab === index ? 'primary.main' : 'text.secondary',
                        transition: '0.3s all'
                      }}>
                        {React.cloneElement(section.icon, { 
                          fontSize: 'medium' 
                        })}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          ...typographyStyles.tabLabel,
                          fontWeight: activeTab === index ? 600 : 500,
                          color: activeTab === index ? 'primary.main' : 'text.secondary',
                          textTransform: 'none'
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>
                  }
                  disableRipple
                  sx={{ 
                    minHeight: '60px',
                    opacity: 1,
                    transition: '0.3s all',
                    textTransform: 'none',
                    fontSize: 'inherit',
                    fontWeight: 'normal',
                    '&.Mui-selected': {
                      background: 'rgba(25, 118, 210, 0.04)',
                    },
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                    }
                  }}
                />
              ))}
            </Tabs>
          </Box>
          
          {/* Tab content with animations and enhanced typography */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, md: 3 },
                  backgroundImage: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.02), rgba(156, 39, 176, 0.02))',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  // Custom typography styles for content
                  '& h6': typographyStyles.sectionTitle,
                  '& p': typographyStyles.paragraph,
                  '& .MuiTypography-subtitle1': typographyStyles.subtitle,
                  '& .MuiListItemText-primary': {
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 600,
                  },
                  '& .MuiListItemText-secondary': {
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiButton-root': {
                    ...typographyStyles.button,
                  },
                  '& .MuiChip-label': {
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500,
                  },
                  '& .MuiAlert-message': {
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  },
                  '& .MuiAlertTitle-root': {
                    fontFamily: '"Montserrat", "Roboto", sans-serif',
                    fontWeight: 600,
                  },
                }}
              >
                {guideSections[activeTab].content}
              </Paper>
            </motion.div>
          </Box>
        </Box>
        
        {/* Footer with navigation buttons */}
        <Box 
          sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.12)', 
            display: 'flex', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            background: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              size={isMobile ? "small" : "medium"}
              sx={{
                ...typographyStyles.button,
                borderRadius: '8px',
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          {/* Tab navigation buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              size={isMobile ? "small" : "medium"}
              sx={{
                ...typographyStyles.button,
                borderRadius: '8px',
              }}
            >
              Previous Section
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setActiveTab(prev => Math.min(guideSections.length - 1, prev + 1))}
              disabled={activeTab === guideSections.length - 1}
              size={isMobile ? "small" : "medium"}
              sx={{
                ...typographyStyles.button,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
              }}
            >
              Next Section
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Quick access navigation cards */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontFamily: '"Montserrat", "Roboto", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#424242',
            fontSize: '1.2rem',
          }}
        >
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={1}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.15)',
                },
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                color: 'white'
              }}
              onClick={() => handleNavigate('/login')}
            >
              <LoginIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography 
                variant="subtitle2"
                sx={{
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                Login
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={1}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(156, 39, 176, 0.15)',
                },
                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                color: 'white'
              }}
              onClick={() => handleNavigate('/live-monitor')}
            >
              <MonitorHeartIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography 
                variant="subtitle2"
                sx={{
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                Live Monitor
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={1}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(2, 136, 209, 0.15)',
                },
                background: 'linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)',
                color: 'white'
              }}
              onClick={() => handleNavigate('/run-script')}
            >
              <RocketLaunchIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography 
                variant="subtitle2"
                sx={{
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                Deployment
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={1}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(46, 125, 50, 0.15)',
                },
                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                color: 'white'
              }}
              onClick={() => handleNavigate('/forecasting')}
            >
              <TrendingUp sx={{ fontSize: 32, mb: 1 }} />
              <Typography 
                variant="subtitle2"
                sx={{
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                Forecasting
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Guide; 