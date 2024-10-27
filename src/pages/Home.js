import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardContent, Button, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ViewList as ModelsIcon,
  Code as ScriptIcon,
  Build as TrainIcon,
  Layers as CustomModelsIcon,
  Videocam as InferVideoIcon,
  CameraAlt as LiveMonitorIcon,
} from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Line, Bar, Pie} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MotionCard = motion(Card);
const primaryColor = 'rgba(0, 150, 255, 1)'; // Bright blue
const secondaryColor = 'rgba(0, 255, 128, 1)'; // Bright green
const tertiaryColor = 'rgba(255, 0, 0, 1)'; // Bright red


const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Model Training Sessions',
      data: [15, 25, 30, 22, 18, 35],
      fill: false,
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
  ],
};

const barData = {
  labels: ['YOLO', 'Faster R-CNN', 'SSD', 'EfficientDet', 'Mask R-CNN'],
  datasets: [
    {
      label: 'Deployed Models',
      data: [8, 5, 3, 7, 4],
      backgroundColor: [primaryColor, secondaryColor, tertiaryColor, primaryColor, secondaryColor],
      borderColor: [primaryColor, secondaryColor, tertiaryColor, primaryColor, secondaryColor],
      borderWidth: 1,
    },
  ],
};

const pieData = {
  labels: ['Pre-trained Models', 'Custom Models', 'Active Training'],
  datasets: [
    {
      label: 'Resource Allocation',
      data: [40, 30, 30],
      backgroundColor: [tertiaryColor, primaryColor, secondaryColor],
      borderColor: [tertiaryColor, primaryColor, secondaryColor],
      borderWidth: 1,
    },
  ],
};

const menuItems = [
  { 
    text: 'Pre-Trained Models', 
    icon: <ModelsIcon />, 
    path: '/models', 
    description: 'Explore a diverse range of AI models at the forefront of technology, constantly evolving to redefine intelligence.' 
  },
  { 
    text: 'Deployment', 
    icon: <ScriptIcon />, 
    path: '/run-script', 
    description: 'Unleash the power of advanced AI scripts and algorithms, tailored to solve the most complex challenges.' 
  },
  { 
    text: 'Train Model', 
    icon: <TrainIcon />, 
    path: '/train-model', 
    description: 'Transform data into intelligent models, built to adapt and innovate autonomously over time.' 
  },
  { 
    text: 'Custom Models', 
    icon: <CustomModelsIcon />, 
    path: '/custom-models', 
    description: 'Curate and manage tailor-made AI models designed with precision to meet specific needs and objectives.' 
  },
  { 
    text: 'Infer Video', 
    icon: <InferVideoIcon />, 
    path: '/infer-video', 
    description: 'Use real-time AI inference on video streams, gaining insights with unparalleled accuracy and speed.' 
  },
  { 
    text: 'Live Monitor', 
    icon: <LiveMonitorIcon />, 
    path: '/live-monitor', 
    description: 'Engage with real-time monitoring systems, powered by cutting-edge AI diagnostics for optimal performance.' 
  },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="purple" wireframe />
      </mesh>
    </>
  );
}

function Home() {
  const theme = useTheme();
  const [activeModels, setActiveModels] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModels(prev => (prev + 1) % 101);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: false,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
<Box
  sx={{
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    marginTop: '-2.7rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, .2)',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <Canvas style={{ height: 320 }}>
    <OrbitControls autoRotate enableZoom={false} />
    <Scene />
  </Canvas>
  <Typography
    variant="h3"
    gutterBottom
    sx={{
      color: 'white',
      fontWeight: 'bold',
      position: 'relative',
      zIndex: 2,
      mt: 1, // Reduced margin-top
    }}
  >
    Welcome to VisionX AI Dashboard
  </Typography>
  <Typography
    variant="h6"
    sx={{
      color: 'white',
      position: 'relative',
      zIndex: 2,
      mb: 2,
    }}
  >
    Empowering the future of AI with cutting-edge vision technology
  </Typography>
</Box>


      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Key Features
      </Typography>
      
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} md={4} key={item.text}>
            <MotionCard
              whileHover={{ scale: 1.03, boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
                boxShadow: '0 3px 5px rgba(0, 0, 0, .2)',
                borderRadius: '10px',
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 40, color: theme.palette.primary.main } })}
                  <Typography variant="h6" sx={{ ml: 2 }}>{item.text}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                  {item.description}
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to={item.path}
                  sx={{
                    mt: 'auto',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    color: 'white',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                    },
                  }}
                >
                  Explore {item.text}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Box 
  sx={{ 
    mt: 5, 
    padding: '2rem', 
    background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.8), rgba(45, 45, 45, 0.8))', // Dark gradient background
    borderRadius: '15px', // Slightly increased border radius
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)', // Deeper shadow for a floating effect
  }}
>
  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 5px rgba(0, 0, 0, 0.6)' }}>
    Dashboard Stats
  </Typography>
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'cyan', fontWeight: 'bold' }}>Monthly Training</Typography>
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px', 
        padding: '1rem', 
        backdropFilter: 'blur(10px)', // Frosted glass effect
        border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for contrast
      }}>
        <Line data={lineData} options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
              },
              ticks: {
                color: 'white', // Tick marks in white
              },
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
              },
              ticks: {
                color: 'white', // Tick marks in white
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend labels in white
              },
            },
          },
        }} />
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'cyan', fontWeight: 'bold' }}>Total Models Deployed</Typography>
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px', 
        padding: '1rem', 
        backdropFilter: 'blur(10px)', // Frosted glass effect
        border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for contrast
      }}>
        <Bar data={barData} options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
              },
              ticks: {
                color: 'white', // Tick marks in white
              },
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
              },
              ticks: {
                color: 'white', // Tick marks in white
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend labels in white
              },
            },
          },
        }} />
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'cyan', fontWeight: 'bold' }}>Live Training</Typography>
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px', 
        padding: '1rem', 
        backdropFilter: 'blur(10px)', // Frosted glass effect
        border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for contrast
      }}>
        <Pie data={pieData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend labels in white
              },
            },
          },
        }} />
      </Box>
    </Grid>
  </Grid>
</Box>

    </Container>
  );
}

export default Home;