// src/pages/TrainModel.js
import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
});



function TrainModel() {
  const [formValues, setFormValues] = useState({
    modelType: '',
    dataPath: '',
    epochs: 50,
    batchSize: 16,
    learningRate: 0.001,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartTraining = () => {
    setLoading(true);
    api.post('/model/train', formValues)
      .then(response => {
        setMessage({ type: 'success', text: response.data.message });
        setLoading(false);
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error starting training' });
        setLoading(false);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Train Model
      </Typography>
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <TextField
        label="Model Type"
        name="modelType"
        value={formValues.modelType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Data Path"
        name="dataPath"
        value={formValues.dataPath}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Epochs"
        name="epochs"
        type="number"
        value={formValues.epochs}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Batch Size"
        name="batchSize"
        type="number"
        value={formValues.batchSize}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Learning Rate"
        name="learningRate"
        type="number"
        value={formValues.learningRate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartTraining}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Start Training'}
      </Button>
    </Container>
  );
}

export default TrainModel;