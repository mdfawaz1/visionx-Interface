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

const primaryColor = 'rgba(0, 150, 255, 1)'; // Bright blue
const secondaryColor = 'rgba(255, 0, 0, 1)'; // Bright red

const MotionCard = motion(Card);

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
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
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
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ color: primaryColor, mb: 1 }}>{model.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Use Case: {model.useCase}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        component={Link} 
                        to={`/custom-models/${model.name}`} 
                        size="small"
                        sx={{
                          background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
                          color: 'white',
                          '&:hover': {
                            background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </MotionCard>
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