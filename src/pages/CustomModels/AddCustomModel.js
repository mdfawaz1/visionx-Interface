import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Typography,
  Box, styled, useTheme, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import api from '../../api';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const tertiaryColor = '#6B37FF';
const gradientBg = `linear-gradient(135deg, ${primaryColor}, ${tertiaryColor}, ${secondaryColor})`;

const GradientTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: primaryColor,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: primaryColor,
    },
  },
});

const GradientButton = styled(Button)({
  background: gradientBg,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(0, 102, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: gradientBg,
    boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
    filter: 'brightness(1.1)',
    transform: 'translateY(-2px)'
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
  const [useCases, setUseCases] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    api.get('/usecases')
      .then(response => setUseCases(response.data))
      .catch(error => console.error('Error fetching use cases:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAdd = () => {
    if (!formValues.name || !formValues.useCase || !formValues.modelFile) {
      setMessage({ type: 'error', text: 'Please fill all required fields and upload a model file.' });
      return;
    }

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
        setTimeout(() => onClose(), 2000);
      })
      .catch(error => {
        setMessage({ type: 'error', text: error.response?.data?.error || 'Error adding custom model' });
        setLoading(false);
      });
  };

  return (
    <Box sx={{ 
      background: gradientBg,
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
      overflow: 'hidden'
    }}>
      <DialogTitle sx={{ 
        background: 'transparent',
        color: 'white',
        fontWeight: 'bold',
        py: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255, 255, 255, 0.2)'
        }
      }}>
        Add Custom Model
      </DialogTitle>
      <DialogContent sx={{ 
        p: 3,
        background: 'white'
      }}>
        <Box my={2}>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert 
                severity={message.type} 
                onClose={() => setMessage(null)}
                sx={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
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
        <FormControl fullWidth margin="normal" required variant="outlined">
          <InputLabel id="use-case-label">Use Case</InputLabel>
          <Select
            labelId="use-case-label"
            name="useCase"
            value={formValues.useCase}
            onChange={handleChange}
            label="Use Case"
          >
            {useCases.map((useCase) => (
              <MenuItem key={useCase._id} value={useCase.name}>
                {useCase.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <GradientTextField
          label="Version"
          name="version"
          value={formValues.version}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Box mt={3}>
          <input
            accept=".h5,.tflite,.pb,.pt"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            name="modelFile"
            onChange={handleChange}
          />
          <label htmlFor="raised-button-file">
            <GradientButton 
              component="span" 
              fullWidth 
              startIcon={<UploadIcon />}
              sx={{
                borderRadius: '12px',
                height: '56px',
                fontSize: '1rem'
              }}
            >
              {formValues.modelFile ? formValues.modelFile.name : 'Upload Model File'}
            </GradientButton>
          </label>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        padding: 3,
        background: 'white',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <GradientButton 
          onClick={handleAdd} 
          disabled={loading}
          sx={{
            minWidth: '120px',
            borderRadius: '10px'
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Add Model'
          )}
        </GradientButton>
      </DialogActions>
    </Box>
  );
}

export default AddCustomModel;