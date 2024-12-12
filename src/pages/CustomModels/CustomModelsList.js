import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions, Button, Dialog,
  Box, useTheme, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Add as AddIcon, ViewList as ModelsIcon } from '@mui/icons-material';
import AddCustomModel from './AddCustomModel';
import api from '../../api'
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

const primaryColor = '#0066FF'; // Vibrant blue
const secondaryColor = '#FF2E93'; // Vibrant pink
const tertiaryColor = '#6B37FF'; // Purple
const gradientBg = `linear-gradient(135deg, ${primaryColor}, ${tertiaryColor}, ${secondaryColor})`;
const softGradientBg = 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';

const MotionCard = motion(Card);

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
            Custom Model
          </Box>
          <Box sx={{
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            background: 'rgba(14, 165, 233, 0.1)',
            color: primaryColor,
            fontSize: '0.75rem',
            fontWeight: 500
          }}>
          <Typography 
            variant="caption"
            sx={{ 
              color: '#FF0000',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {`Version ${model.currentVersion || '1.0'}`}

          </Typography>
        </Box>
        </Box>

        <Button 
          component={Link} 
          to={`/custom-models/${model.name}`}
          fullWidth
          sx={{
            background: gradientBg,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
            color: 'white',
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

function CustomModelsList() {
  const [models, setModels] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsLoading(true);
    api.get('/custom-models')
      .then(response => {
        setModels(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching custom models:', error);
        setError('Failed to fetch custom models. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  const handleAddModel = (newModel) => {
    setModels(prevModels => [...prevModels, newModel]);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        marginTop:'-6rem',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: 'transparent',
          backgroundImage: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          mb: 3
        }}>
          <ModelsIcon sx={{ fontSize: 40, marginRight: 2, color: primaryColor }} />
          Custom Models
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{
            mb: 3,
            background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
            color: 'white',
            '&:hover': {
              background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            },
          }}
        >
          Add Custom Model
        </Button>
        <Dialog 
          open={openAddDialog} 
          onClose={() => setOpenAddDialog(false)}
          fullScreen={isMobile}
          PaperProps={{
            style: {
              background: 'transparent',
              boxShadow: 'none'
            }
          }}
        >
          <AddCustomModel onClose={() => setOpenAddDialog(false)} onAdd={handleAddModel} />
        </Dialog>
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
            <Typography variant="h6">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {models.map(model => (
                <Grid item xs={12} sm={6} md={4} key={model._id}>
                  <ModelCard
                    model={model}
                    onClick={() => {}}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default CustomModelsList;