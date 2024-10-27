// src/pages/InferVideo/InferCustomModelVideo.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:26000/api/v1',
  });
function InferCustomModelVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [modelName, setModelName] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Fetch custom models
    api.get('/custom-models')
      .then(response => setModels(response.data))
      .catch(error => console.error('Error fetching custom models:', error));
  }, []);

  const handleInfer = () => {
    if (!videoFile || !modelName) {
      setMessage({ type: 'error', text: 'Please select a video file and model.' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('videoFile', videoFile);

    api.post(`/custom-model/${modelName}/upload-video`, formData)
      .then(response => {
        setMessage({ type: 'success', text: response.data.message });
        setLoading(false);
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error processing video' });
        setLoading(false);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Run Custom Model on Video
      </Typography>
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <Button
        variant="contained"
        component="label"
        fullWidth
        style={{ marginTop: 20 }}
      >
        Upload Video File
        <input
          type="file"
          hidden
          accept="video/*"
          onChange={e => setVideoFile(e.target.files[0])}
        />
      </Button>
      {videoFile && <Typography>{videoFile.name}</Typography>}
      <TextField
        select
        label="Select Custom Model"
        value={modelName}
        onChange={e => setModelName(e.target.value)}
        fullWidth
        margin="normal"
        required
        SelectProps={{ native: true }}
      >
        <option value=""></option>
        {models.map(model => (
          <option key={model._id} value={model.name}>
            {model.name}
          </option>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleInfer}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Run Model'}
      </Button>
    </Container>
  );
}

export default InferCustomModelVideo;