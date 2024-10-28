import React, { useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Typography,
  Box, styled, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
});

const primaryColor = 'rgba(0, 150, 255, 1)'; // Bright blue
const secondaryColor = 'rgba(255, 0, 0, 1)'; // Bright red

const GradientTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: primaryColor,
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: primaryColor,
    },
  },
});

const GradientButton = styled(Button)({
  background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
  },
});

function AddCustomModel({ onClose, onAdd }) {
  const [formValues, setFormValues] = useState({
    name: '',
    useCase: '',
    version: '',
    modelFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const theme = useTheme();

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAdd = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('useCase', formValues.useCase);
    formData.append('version', formValues.version);
    formData.append('modelFile', formValues.modelFile);

    api.post('/custom-model/add', formData)
      .then(response => {
        setMessage({ type: 'success', text: response.data.message });
        onAdd(response.data.model);
        setLoading(false);
        setTimeout(() => onClose(), 2000); // Close after 2 seconds
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error adding custom model' });
        setLoading(false);
      });
  };

  return (
    <Box sx={{ 
      background: 'white', 
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
    }}>
      <DialogTitle sx={{ 
        background: `linear-gradient(45deg, ${secondaryColor} 30%, ${primaryColor} 90%)`,
        color: 'white',
        fontWeight: 'bold'
      }}>
        Add Custom Model
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert severity={message.type} onClose={() => setMessage(null)}>
                {message.text}
              </Alert>
            </motion.div>
          )}
        </Box>
        <GradientTextField
          label="Model Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          variant="outlined"
        />
        <GradientTextField
          label="Use Case"
          name="useCase"
          value={formValues.useCase}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          variant="outlined"
        />
        <GradientTextField
          label="Version"
          name="version"
          value={formValues.version}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          variant="outlined"
        />
        <Box mt={2}>
          <input
            accept=".h5,.tflite,.pb"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            name="modelFile"
            onChange={handleChange}
          />
          <label htmlFor="raised-button-file">
            <GradientButton component="span" fullWidth startIcon={<UploadIcon />}>
              Upload Model File
            </GradientButton>
          </label>
        </Box>
        {formValues.modelFile && (
          <Typography variant="body2" sx={{ mt: 1, color: primaryColor }}>
            Selected file: {formValues.modelFile.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(2) }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: secondaryColor }}>
          Cancel
        </Button>
        <GradientButton onClick={handleAdd} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Model'}
        </GradientButton>
      </DialogActions>
    </Box>
  );
}

export default AddCustomModel;