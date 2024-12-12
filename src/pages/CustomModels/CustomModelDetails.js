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
  DialogContentText,
  DialogActions,
  TextField,
  Box,
  styled,
  useTheme
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Trash2 } from 'lucide-react';
import api from '../../api';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const tertiaryColor = '#6B37FF';
const gradientBg = `linear-gradient(135deg, ${primaryColor}, ${tertiaryColor}, ${secondaryColor})`;
const softGradientBg = 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 102, 255, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: gradientBg,
    opacity: 0.8
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: gradientBg,
  color: 'white',
  padding: '10px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: gradientBg,
    boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
    filter: 'brightness(1.1)',
    transform: 'translateY(-2px)'
  }
}));

const ModelFileTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(0, 102, 255, 0.1)',
  color: primaryColor,
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 500,
  gap: '6px',
  '& svg': {
    width: 16,
    height: 16
  }
}));

function CustomModelDetails() {
  const { modelName } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.pt') || file.name.endsWith('.onnx'))) {
      setSelectedFile(file);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid .pt or .onnx file' });
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

  const handleDeleteModel = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/custom-model/${modelName}`);
      setMessage({ type: 'success', text: response.data.message });
      handleDeleteDialogClose();
      // Navigate back to the models list or dashboard
      navigate('/custom-models');
    } catch (error) {
      console.error('Error deleting model:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error deleting model' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getModelFileName = (filePath) => {
    if (!filePath) return 'model.pt';
    return filePath.split('/').pop(); // Gets the last part of the path
  };

  if (!model) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        background: 'white',
        borderRadius: '30px',
        padding: '2rem',
        marginBottom: '2rem',
        marginTop: '-5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ 
            color: 'transparent',
            backgroundImage: gradientBg,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            fontWeight: 600
          }}>
            {model.name}
          </Typography>
          <Box>
            <GradientButton
              startIcon={<Upload />}
              onClick={handleUploadDialogOpen}
              sx={{ mr: 2 }}
            >
              Upload New Version
            </GradientButton>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash2 />}
              onClick={handleDeleteDialogOpen}
              sx={{
                borderRadius: '12px',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Delete Model
            </Button>
          </Box>
        </Box>

        {message && (
          <Alert 
            severity={message.type} 
            onClose={() => setMessage(null)}
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Box sx={{
            background: 'rgba(14, 165, 233, 0.1)',
            padding: '0.75rem 1.5rem',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" color={primaryColor}>
              Use Case: {model.useCase}
            </Typography>
          </Box>
          <Box sx={{
            background: 'rgba(14, 165, 233, 0.1)',
            padding: '0.75rem 1.5rem',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" color={primaryColor}>
              Current Version: {model.currentVersion}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ 
          mb: 3,
          color: '#0F172A',
          fontWeight: 600
        }}>
          Versions
        </Typography>

        <Grid container spacing={3}>
          {model.versions.map(version => (
            <Grid item xs={12} sm={6} md={4} key={version._id}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: '#0F172A',
                      mb: 0.5
                    }}>
                      Version {version.version}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                      Created: {new Date(version.createdAt).toLocaleString()}
                    </Typography>
                    <ModelFileTag>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      {getModelFileName(version.CustomModelfilePath)}
                    </ModelFileTag>
                  </Box>
                  
                  {model.currentVersion === version.version ? (
                    <Box sx={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      color: '#4ade80',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 2
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>✓</span>
                      Current Version
                    </Box>
                  ) : (
                    <GradientButton
                      onClick={() => handleSwitchVersion(version.version)}
                      disabled={loading}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Switch to this Version
                    </GradientButton>
                  )}
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
                  accept=".pt,.onnx"
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
                    {selectedFile ? selectedFile.name : 'Select Model File (.pt,.onnx)'}
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

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Custom Model"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this custom model? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteModel} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default CustomModelDetails;