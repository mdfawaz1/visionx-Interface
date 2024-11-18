import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Typography,
  Box, styled, useTheme, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import api from '../../api';

const primaryColor = 'rgba(0, 150, 255, 1)';
const secondaryColor = 'rgba(255, 0, 0, 1)';

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
        <Box mt={2}>
          <input
            accept=".h5,.tflite,.pb,.pt"
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