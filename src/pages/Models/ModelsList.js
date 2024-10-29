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

const primaryColor = 'rgba(0, 150, 255, 1)'; // Bright blue
const secondaryColor = 'rgba(255, 0, 0, 1)'; // Bright red

const ModelCard = ({ model, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    whileHover={{ scale: 1.05, boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}
  >
    <Card 
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" sx={{ color: primaryColor, mb: 2 }}>
          {model.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Use Case: {model.useCase}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Created: {new Date(model.createdAt).toLocaleString()}
        </Typography>
        <Button 
          variant="contained" 
          sx={{
            mt: 'auto',
            background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
            color: 'white',
            '&:hover': {
              background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const ModelDetails = ({ model, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 50 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 50 }}
  >
    <Card sx={{
      maxWidth: 400,
      width: '90%',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ color: primaryColor, mb: 2 }}>
          {model.name}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1 }}>
          <strong>Use Case:</strong> {model.useCase}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1 }}>
          <strong>Created:</strong> {new Date(model.createdAt).toLocaleString()}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          <strong>Description:</strong> {model.description || 'No description available.'}
        </Typography>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
            color: 'white',
            '&:hover': {
              background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            },
          }}
        >
          Close
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

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
          progressStyle: { background: `linear-gradient(to right, ${secondaryColor}, ${primaryColor})` },
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
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        marginTop:'-5.7rem',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: 'transparent',
          backgroundImage: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          display: 'flex',
          alignItems: 'center' 
        }}>
          <ModelsIcon sx={{ fontSize: 40, marginRight: 2, color: primaryColor }} />
          Pre-Trained Models
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: `4px solid ${primaryColor}`,
                borderTop: `4px solid ${secondaryColor}`,
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
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          >
            <ModelDetails model={selectedModel} onClose={handleCloseDialog} />
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