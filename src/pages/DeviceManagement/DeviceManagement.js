import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  MenuItem,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel,
  Container,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  PlayArrow,
  Stop,
  Refresh,
  ViewList,
  ViewModule,
  Videocam,
} from '@mui/icons-material';
import api from '../../api';
import { motion } from 'framer-motion';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const gradientBg = 'linear-gradient(135deg, #0066FF, #6B37FF, #FF2E93)';
const softGradientBg = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(107, 55, 255, 0.1), rgba(255, 46, 147, 0.1))';

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'rtsp',  // Set default type
    streamUrl: '',
    location: '',
    status: 'active',
    metadata: {
      manufacturer: '',
      model: '',
    },
  });
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const deviceTypes = ['rtsp', 'camera', 'other'];
  const statusOptions = ['active', 'inactive', 'maintenance'];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/device-management/devices');
      setDevices(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch devices. Please try again later.');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Device name is required');
      return false;
    }
    if (!formData.type) {
      setError('Device type is required');
      return false;
    }
    if (!formData.streamUrl.trim()) {
      setError('Stream URL is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleOpen = (device = null) => {
    setError('');
    if (device) {
      setEditMode(true);
      setSelectedDevice(device);
      setFormData({
        ...device,
        metadata: device.metadata || { manufacturer: '', model: '' },
      });
    } else {
      setEditMode(false);
      setSelectedDevice(null);
      setFormData({
        name: '',
        type: 'rtsp',
        streamUrl: '',
        location: '',
        status: 'active',
        metadata: {
          manufacturer: '',
          model: '',
        },
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedDevice(null);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      if (editMode) {
        await api.put(`/device-management/devices/${selectedDevice._id}`, formData);
        setSuccess('Device updated successfully');
      } else {
        await api.post('/device-management/devices', formData);
        setSuccess('Device added successfully');
      }
      fetchDevices();
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while saving the device';
      setError(errorMessage);
      console.error('Error saving device:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deviceId) => {
    setDeviceToDelete(deviceId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/device-management/devices/${deviceToDelete}`);
      setSuccess('Device deleted successfully');
      fetchDevices();
    } catch (error) {
      setError('Failed to delete device. Please try again.');
      console.error('Error deleting device:', error);
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setDeviceToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (device) => {
    setSelectedDeviceDetails(device);
    setDetailsOpen(true);
  };

  const GridView = () => (
    <Grid container spacing={3}>
      {devices.map((device) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={device._id}>
          <Card 
            onClick={() => handleViewDetails(device)}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '20px',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 20px rgba(0, 102, 255, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: gradientBg,
              }}
            />
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    color: '#1e293b'
                  }}
                >
                  {device.name}
                </Typography>
                <Chip
                  label={device.status}
                  color={getStatusColor(device.status)}
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'capitalize'
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Type:
                  </Typography>
                  <Typography variant="body2">
                    {device.type.toUpperCase()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Location:
                  </Typography>
                  <Typography variant="body2">
                    {device.location}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                mt: 'auto',
                pt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                marginTop: 2
              }}>
                <Tooltip title="Edit Device">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(device);
                    }} 
                    size="small"
                    sx={{
                      color: primaryColor,
                      '&:hover': {
                        background: `${primaryColor}15`,
                      }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Device">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(device._id);
                    }} 
                    size="small"
                    sx={{
                      color: '#ef4444',
                      '&:hover': {
                        background: '#ef444415',
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const ListView = () => (
    <TableContainer 
      component={Paper}
      sx={{
        borderRadius: '15px',
        '& .MuiTableRow-root': {
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 102, 255, 0.05)',
          },
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow 
              key={device._id}
              onClick={() => handleViewDetails(device)}
              hover
            >
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.type}</TableCell>
              <TableCell>{device.location}</TableCell>
              <TableCell>
                <Chip
                  label={device.status}
                  color={getStatusColor(device.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit Device">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleOpen(device);
                    }} 
                    disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Device">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleDelete(device._id);
                    }} 
                    disabled={loading}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            p: 4,
            borderRadius: '30px',
            background: '#ffffff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: gradientBg,
              borderRadius: '30px 30px 0 0',
            }
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4
          }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: gradientBg,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Videocam sx={{ fontSize: 40, color: primaryColor }} />
              Device Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchDevices}
                disabled={loading}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: secondaryColor,
                    background: 'rgba(0, 102, 255, 0.05)',
                  },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={viewMode === 'grid' ? <ViewList /> : <ViewModule />}
                onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: secondaryColor,
                    background: 'rgba(0, 102, 255, 0.05)',
                  },
                }}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpen()}
                disabled={loading}
                sx={{
                  background: gradientBg,
                  color: 'white',
                  '&:hover': {
                    background: gradientBg,
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                Add Device
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            minHeight: 400,
            background: softGradientBg,
            borderRadius: '20px',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
                minHeight: 400
              }}>
                <CircularProgress sx={{ color: primaryColor }} />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {viewMode === 'grid' ? <GridView /> : <ListView />}
              </motion.div>
            )}
          </Box>
        </Paper>

        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle sx={{
            background: gradientBg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {editMode ? <Edit /> : <Add />}
            {editMode ? 'Edit Device' : 'Add New Device'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                required
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!formData.name.trim()}
                helperText={!formData.name.trim() ? 'Name is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                select
                required
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {deviceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Stream URL"
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                error={!formData.streamUrl.trim()}
                helperText={!formData.streamUrl.trim() ? 'Stream URL is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                required
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                error={!formData.location.trim()}
                helperText={!formData.location.trim() ? 'Location is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Manufacturer"
                value={formData.metadata.manufacturer}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, manufacturer: e.target.value }
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                label="Model"
                value={formData.metadata.model}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, model: e.target.value }
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              sx={{
                color: primaryColor,
                '&:hover': {
                  background: 'rgba(0, 102, 255, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={loading}
              sx={{
                background: gradientBg,
                color: 'white',
                '&:hover': {
                  background: gradientBg,
                  filter: 'brightness(1.1)',
                },
              }}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle sx={{
            background: gradientBg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Visibility />
            Device Details
          </DialogTitle>
          <DialogContent>
            {selectedDeviceDetails && (
              <Box sx={{ pt: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: softGradientBg,
                    borderRadius: '15px',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: primaryColor,
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                        {selectedDeviceDetails.name}
                      </Typography>
                      <Chip
                        label={selectedDeviceDetails.status}
                        color={getStatusColor(selectedDeviceDetails.status)}
                        sx={{ 
                          borderRadius: '8px',
                          fontWeight: 500
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                      <Typography>{selectedDeviceDetails.type.toUpperCase()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                      <Typography>{selectedDeviceDetails.location}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Stream URL</Typography>
                      <Typography
                        sx={{
                          wordBreak: 'break-all',
                          bgcolor: 'grey.100',
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {selectedDeviceDetails.streamUrl}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Manufacturer</Typography>
                      <Typography>{selectedDeviceDetails.metadata?.manufacturer || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Model</Typography>
                      <Typography>{selectedDeviceDetails.metadata?.model || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDetailsOpen(false)}
              variant="contained"
              sx={{
                background: gradientBg,
                color: 'white',
                '&:hover': {
                  background: gradientBg,
                  filter: 'brightness(1.1)',
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle sx={{
            background: gradientBg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Delete />
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1, px: 3, mt: 2 }}>
            <Typography>
              Are you sure you want to delete this device? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={loading}
              sx={{
                color: primaryColor,
                '&:hover': {
                  background: 'rgba(0, 102, 255, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="contained"
              disabled={loading}
              sx={{
                background: '#ef4444',
                color: 'white',
                '&:hover': {
                  background: '#dc2626',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default DeviceManagement; 