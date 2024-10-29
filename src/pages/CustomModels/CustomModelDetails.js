import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  styled,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
// import axios from 'axios';
import api from '../../api'
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
  },
}));

function CustomModelDetails() {
  const { modelName } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [version, setVersion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetchModelDetails();
  }, [modelName]);

  const fetchModelDetails = () => {
    api.get(`/custom-model/${modelName}`)
      .then(response => setModel(response.data))
      .catch(error => {
        console.error('Error fetching model details:', error);
        setMessage({ type: 'error', text: 'Error fetching model details' });
      });
  };

  const handleSwitchVersion = (version) => {
    setLoading(true);
    api.post(`/custom-model/${modelName}/version/${version}/switch`)
      .then(response => {
        setModel(response.data.model);
        setMessage({ type: 'success', text: response.data.message });
        setLoading(false);
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error switching version' });
        setLoading(false);
      });
  };

  const handleUploadDialogOpen = () => {
    setOpenUploadDialog(true);
  };

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false);
    setVersion('');
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.pt')) {
      setSelectedFile(file);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid .pt file' });
      setSelectedFile(null);
    }
  };

  const handleUploadVersion = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a model file' });
      return;
    }

    const formData = new FormData();
    if (version.trim()) {
      formData.append('version', version.trim());
    }
    formData.append('modelFile', selectedFile);

    try {
      setLoading(true);
      const response = await api.post(
        `/custom-model/${modelName}/version`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      setMessage({ type: 'success', text: 'New version uploaded successfully' });
      setModel(response.data.model);
      handleUploadDialogClose();
      fetchModelDetails();
    } catch (error) {
      console.error('Error uploading new version:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error uploading new version' 
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!model) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        marginTop:'-5rem',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ 
            color: 'transparent',
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
          }}>
            {model.name}
          </Typography>
          <GradientButton
            startIcon={<Upload />}
            onClick={handleUploadDialogOpen}
          >
            Upload New Version
          </GradientButton>
        </Box>

        {message && (
          <Alert 
            severity={message.type} 
            onClose={() => setMessage(null)}
            sx={{ mb: 2 }}
          >
            {message.text}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 1 }}>Use Case: {model.useCase}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>Current Version: {model.currentVersion}</Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Versions:
        </Typography>

        <Grid container spacing={3}>
          {model.versions.map(version => (
            <Grid item xs={12} sm={6} md={4} key={version._id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Version {version.version}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Created At: {new Date(version.createdAt).toLocaleString()}
                  </Typography>
                  <GradientButton
                    onClick={() => handleSwitchVersion(version.version)}
                    disabled={model.currentVersion === version.version || loading}
                    fullWidth
                  >
                    {model.currentVersion === version.version ? 'Current Version' : 'Switch Version'}
                  </GradientButton>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openUploadDialog} onClose={handleUploadDialogClose}>
          <DialogTitle sx={{ 
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            Upload New Version
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Version Number (Optional)"
                type="text"
                fullWidth
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                margin="normal"
                placeholder="e.g., 2.0"
                helperText="Leave empty for automatic version numbering"
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept=".pt"
                  id="model-file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <label htmlFor="model-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    {selectedFile ? selectedFile.name : 'Select Model File (.pt)'}
                  </Button>
                </label>
              </Box>
              {uploadProgress > 0 && (
                <Box sx={{ mt: 2, width: '100%', display: 'flex', alignItems: 'center' }}>
                  <CircularProgress
                    variant="determinate"
                    value={uploadProgress}
                    size={24}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {`${uploadProgress}%`}
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button onClick={handleUploadDialogClose} disabled={loading}>
              Cancel
            </Button>
            <GradientButton 
              onClick={handleUploadVersion} 
              disabled={loading || !selectedFile}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </GradientButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default CustomModelDetails;