// src/pages/Models/ModelsList.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Google Font
import './ModelsList.css'; // Importing CSS for custom styles

const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
});

function ModelsList() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
        toast.success('Models fetched successfully!');
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Error fetching models.');
      }
    };

    fetchModels();
  }, []);

  const handleOpenDialog = (model) => {
    setSelectedModel(model);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedModel(null);
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        Stored Models
      </Typography>
      <Grid container spacing={3}>
        {models.map(model => (
          <Grid item xs={12} sm={6} md={4} key={model._id}>
            <motion.div
              whileHover={{ scale: 1.05 }} // Scale on hover
              whileTap={{ scale: 0.95 }} // Scale down on tap
            >
              <Card
                onClick={() => handleOpenDialog(model)}
                sx={{
                  transition: '0.3s',
                  bgcolor: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                    {model.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    Use Case: {model.useCase}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    Created At: {new Date(model.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="contained" sx={{ borderRadius: 2, fontFamily: 'Inter, sans-serif' }}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for displaying model details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontFamily: 'Inter, sans-serif' }}>{selectedModel?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Use Case:</strong> {selectedModel?.useCase}
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Created At:</strong> {new Date(selectedModel?.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Description:</strong> {selectedModel?.description || 'No description available.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" sx={{ fontFamily: 'Inter, sans-serif' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
    </Container>
  );
}

export default ModelsList;
