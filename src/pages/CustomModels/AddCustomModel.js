// src/pages/CustomModels/AddCustomModel.js
import React, { useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert,Typography,
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
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
        onClose();
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error adding custom model' });
        setLoading(false);
      });
  };

  return (
    <>
      <DialogTitle>Add Custom Model</DialogTitle>
      <DialogContent>
        {message && (
          <Alert severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}
        <TextField
          label="Model Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Use Case"
          name="useCase"
          value={formValues.useCase}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Version"
          name="version"
          value={formValues.version}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button variant="contained" component="label" fullWidth>
          Upload Model File
          <input type="file" name="modelFile" hidden onChange={handleChange} />
        </Button>
        {formValues.modelFile && <Typography>{formValues.modelFile.name}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleAdd} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Model'}
        </Button>
      </DialogActions>
    </>
  );
}

export default AddCustomModel;