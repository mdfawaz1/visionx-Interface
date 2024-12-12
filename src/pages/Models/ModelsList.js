import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography, Container, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { ViewList as ModelsIcon } from '@mui/icons-material';
import api from '../../api'
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

const primaryColor = '#0066FF'; // Vibrant blue
const secondaryColor = '#FF2E93'; // Vibrant pink
const gradientBg = 'linear-gradient(135deg, #0066FF, #6B37FF, #FF2E93)'; // Triple gradient for more depth
const softGradientBg = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(107, 55, 255, 0.1), rgba(255, 46, 147, 0.1))';

const ModelCard = ({ model, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <Card 
      onClick={onClick}
      sx={{
        height: '100%',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0, 102, 255, 0.2)',
          '& .model-gradient': {
            height: '100%',
            opacity: 0.08,
            background: `${gradientBg}, ${softGradientBg}`
          }
        }
      }}
    >
      <Box 
        className="model-gradient"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradientBg,
          transition: 'all 0.3s ease-in-out',
          opacity: 1,
          filter: 'brightness(1.2)'
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6"
            sx={{ 
              fontWeight: 600,
              color: '#0F172A',
              mb: 0.5
            }}
          >
            {model.name}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              color: '#64748B',
              fontSize: '0.875rem'
            }}
          >
            {model.useCase}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3
        }}>
          <Box sx={{
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            background: 'rgba(14, 165, 233, 0.1)',
            color: primaryColor,
            fontSize: '0.75rem',
            fontWeight: 500
          }}>
            AI Model
          </Box>
          <Typography 
            variant="caption"
            sx={{ 
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {new Date(model.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Button 
          fullWidth
          variant="contained"
          sx={{
            background: gradientBg,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: gradientBg,
              boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
              filter: 'brightness(1.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} = require('recharts');

// Add these constants for the metrics section
const COLORS = ['#0066FF', '#6B37FF', '#FF2E93', '#FF9900'];

const MetricCard = ({ title, value, unit, icon }) => (
  <Box sx={{
    background: softGradientBg,
    borderRadius: '12px',
    p: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }}>
    <Box sx={{
      width: 45,
      height: 45,
      borderRadius: '12px',
      background: gradientBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
        {value}{unit}
      </Typography>
    </Box>
  </Box>
);

const ModelDetails = ({ model, onClose }) => {
  // Sample data - replace with actual model metrics
  const accuracyData = [
    { name: 'Train', value: 95 },
    { name: 'Validation', value: 92 },
    { name: 'Test', value: 90 },
  ];

  const performanceData = [
    { name: 'Day 1', accuracy: 85, loss: 0.3 },
    { name: 'Day 2', accuracy: 88, loss: 0.25 },
    { name: 'Day 3', accuracy: 90, loss: 0.2 },
    { name: 'Day 4', accuracy: 92, loss: 0.18 },
    { name: 'Day 5', accuracy: 93, loss: 0.15 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card sx={{
        maxWidth: '99%',
        width: '99%',
        maxHeight: '90vh',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Box sx={{
          background: gradientBg,
          py: 3,
          px: 4,
          color: 'white',
          position: 'relative',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {model.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {model.useCase}
          </Typography>
        </Box>

        <Box sx={{ 
          p: 4, 
          maxHeight: 'calc(90vh - 100px)', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: softGradientBg,
            borderRadius: '4px',
          },
        }}>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="Accuracy" 
                value="95" 
                unit="%" 
                icon="📊"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="Precision" 
                value="0.92" 
                unit="" 
                icon="🎯"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="Recall" 
                value="0.89" 
                unit="" 
                icon="📈"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard 
                title="F1" 
                value="0.90" 
                unit="" 
                icon="⚖️"
              />
            </Grid>
          </Grid>

          {/* Performance Graph */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0F172A' }}>
              Training Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#0066FF"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="loss"
                    stroke="#FF2E93"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Accuracy Distribution */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0F172A' }}>
              Accuracy Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0F172A' }}>
              Model Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: softGradientBg,
                  borderRadius: '12px',
                  p: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                    <strong>Created:</strong> {new Date(model.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                    <strong>Framework:</strong> TensorFlow
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    <strong>Size:</strong> 245 MB
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: softGradientBg,
                  borderRadius: '12px',
                  p: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                    <strong>Training Duration:</strong> 2.5 hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                    <strong>Training Data:</strong> 10,000 samples
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    <strong>Last Updated:</strong> {new Date().toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Button 
            onClick={onClose}
            fullWidth
            variant="contained"
            sx={{
              background: gradientBg,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5,
              '&:hover': {
                background: gradientBg,
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
                filter: 'brightness(1.1)',
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const ModelsList = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/models');
      console.log('API Response:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setModels(response.data);
        toast.success(`${response.data.length} models fetched successfully!`, {
          icon: '🚀',
          progressStyle: { 
            background: gradientBg,
            filter: 'brightness(1.1)'
          },
        });
      } else {
        setModels([]);
        toast.info('No models found.', {
          icon: '📭',
          progressStyle: { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` },
        });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError(error.message || 'An error occurred while fetching models.');
      toast.error('Error fetching models.', {
        icon: '❌',
        progressStyle: { background: `linear-gradient(to right, ${secondaryColor}, ${primaryColor})` },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleOpenDialog = (model) => setSelectedModel(model);
  const handleCloseDialog = () => setSelectedModel(null);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        background: '#ffffff',
        borderRadius: '30px',
        p: 4,
        mb: 4,
        marginTop: '-5.7rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ModelsIcon sx={{ 
              fontSize: 40, 
              color: primaryColor,
              filter: 'drop-shadow(0 2px 4px rgba(14, 165, 233, 0.2))'
            }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: gradientBg,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Pre-Trained Models
            </Typography>
          </Box>
          <Box sx={{
            px: 2,
            py: 1,
            borderRadius: '20px',
            background: 'rgba(14, 165, 233, 0.1)',
            color: primaryColor,
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {models.length} Models Available
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `conic-gradient(from 0deg, ${gradientBg})`,
                filter: 'brightness(1.2)',
                boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)'
              }}
            />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', color: secondaryColor, my: 4 }}>
            <Typography variant="h6">Error: {error}</Typography>
            <Button 
              onClick={fetchModels} 
              sx={{ 
                mt: 2, 
                background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
                color: 'white',
                '&:hover': {
                  background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                },
              }}
            >
              Retry
            </Button>
          </Box>
        ) : models.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
            <Typography variant="h6">No models found</Typography>
            <Typography>It seems there are no models available at the moment.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {models.map(model => (
                <Grid item xs={12} sm={6} md={4} key={model._id}>
                  <ModelCard model={model} onClick={() => handleOpenDialog(model)} />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Box>

      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              paddingTop: '5vh',
              overflow: 'auto',
            }}
          >
            <Box sx={{ 
              marginTop: '40px',
              marginLeft: '30px',
              marginRight: '-60px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <ModelDetails model={selectedModel} onClose={handleCloseDialog} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default ModelsList;