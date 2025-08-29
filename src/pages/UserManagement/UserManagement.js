import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Grid,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const PAGES = [
  { value: 'models', label: 'Models' },
  { value: 'customModels', label: 'Custom Models' },
  { value: 'monitoring', label: 'Live Monitoring' },
  { value: 'training', label: 'Model Training' },
  { value: 'incidents', label: 'Incidents' },
  { value: 'devices', label: 'Device Management' },
  { value: 'forecasting', label: 'Forecasting' },
  { value: 'logs', label: 'Log Viewer' },
  { value: 'admin', label: 'Administration' },
];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [userDialog, setUserDialog] = useState(false);
  const [tenantDialog, setTenantDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser, isMaster } = useAuth();

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    tenantId: currentUser?.tenantId || '', // Default to current user's tenant
    permissions: {
      canViewPages: [],
      canAccessCustomModels: false,
      canManageUsers: false,
    },
    sessionConfig: {
      maxSessionDuration: 480,
      expiresAt: null,
    },
  });

  const [tenantForm, setTenantForm] = useState({
    name: '',
    description: '',
    settings: {
      maxUsers: 10,
      maxCustomModels: 5,
      allowedFeatures: [],
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Load users
      const usersData = await authService.listUsers(token);
      setUsers(usersData);

      // Load tenants
      try {
        const tenantsData = await authService.listTenants(token);
        setTenants(tenantsData);
      } catch (error) {
        console.error('Failed to load tenants:', error);
        // If tenants fail to load, at least show current user's tenant
        if (currentUser) {
          setTenants([{
            tenantId: currentUser.tenantId,
            name: currentUser.tenantName || 'Current Tenant',
            _id: currentUser.tenantId
          }]);
        }
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await authService.registerUser(userForm, token);
      toast.success('User created successfully');
      setUserDialog(false);
      resetUserForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const updateData = {
        permissions: userForm.permissions,
        sessionConfig: userForm.sessionConfig,
        isActive: userForm.isActive !== false,
      };
      
      await authService.updateUserPermissions(editingUser._id, updateData, token);
      toast.success('User updated successfully');
      setUserDialog(false);
      setEditingUser(null);
      resetUserForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleCreateTenant = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await authService.createTenant(tenantForm, token);
      toast.success('Tenant created successfully');
      setTenantDialog(false);
      resetTenantForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create tenant');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'user',
      tenantId: currentUser?.tenantId || '',
      permissions: {
        canViewPages: [],
        canAccessCustomModels: false,
        canManageUsers: false,
      },
      sessionConfig: {
        maxSessionDuration: 480,
        expiresAt: null,
      },
    });
  };

  const resetTenantForm = () => {
    setTenantForm({
      name: '',
      description: '',
      settings: {
        maxUsers: 10,
        maxCustomModels: 5,
        allowedFeatures: [],
      },
    });
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setUserForm({
      ...user,
      password: '', // Don't populate password for editing
    });
    setUserDialog(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'master': return 'error';
      case 'admin': return 'warning';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUserDialog(true)}
          >
            Add User
          </Button>
          {isMaster() && (
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={() => setTenantDialog(true)}
            >
              Add Tenant
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Users" icon={<PersonIcon />} iconPosition="start" />
          {isMaster() && <Tab label="Tenants" icon={<BusinessIcon />} iconPosition="start" />}
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Tenant</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Session Expires</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.role === 'master' && <AdminIcon color="error" />}
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.toUpperCase()} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const tenant = tenants.find(t => t.tenantId === user.tenantId);
                      return tenant ? `${tenant.name} (${user.tenantId})` : user.tenantId;
                    })()}
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<BlockIcon />}
                        label="Inactive"
                        color="error"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    {user.sessionConfig?.expiresAt 
                      ? new Date(user.sessionConfig.expiresAt).toLocaleString()
                      : 'No limit'
                    }
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => openEditDialog(user)}
                        disabled={user.role === 'master' && !isMaster()}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Dialog */}
      <Dialog open={userDialog} onClose={() => {
        setUserDialog(false);
        setEditingUser(null);
        resetUserForm();
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {!editingUser && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                  />
                </Grid>
              </>
            )}
            
            {!editingUser && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      {isMaster() && <MenuItem value="master">Master</MenuItem>}
                    </Select>
                  </FormControl>
                </Grid>
                {isMaster() && tenants.length > 0 && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Tenant</InputLabel>
                      <Select
                        value={userForm.tenantId}
                        onChange={(e) => setUserForm({ ...userForm, tenantId: e.target.value })}
                        label="Tenant"
                        required
                      >
                        {tenants.map((tenant) => (
                          <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                            {tenant.name} ({tenant.tenantId})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Permissions</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userForm.permissions.canAccessCustomModels}
                      onChange={(e) => setUserForm({
                        ...userForm,
                        permissions: {
                          ...userForm.permissions,
                          canAccessCustomModels: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Can Access Custom Models"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={userForm.permissions.canManageUsers}
                      onChange={(e) => setUserForm({
                        ...userForm,
                        permissions: {
                          ...userForm.permissions,
                          canManageUsers: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Can Manage Users"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Page Access</Typography>
              <FormGroup row>
                {PAGES.map((page) => (
                  <FormControlLabel
                    key={page.value}
                    control={
                      <Checkbox
                        checked={userForm.permissions.canViewPages.includes(page.value)}
                        onChange={(e) => {
                          const pages = e.target.checked
                            ? [...userForm.permissions.canViewPages, page.value]
                            : userForm.permissions.canViewPages.filter(p => p !== page.value);
                          setUserForm({
                            ...userForm,
                            permissions: {
                              ...userForm.permissions,
                              canViewPages: pages
                            }
                          });
                        }}
                      />
                    }
                    label={page.label}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Session Configuration</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Session Duration (minutes)"
                type="number"
                value={userForm.sessionConfig.maxSessionDuration}
                onChange={(e) => setUserForm({
                  ...userForm,
                  sessionConfig: {
                    ...userForm.sessionConfig,
                    maxSessionDuration: parseInt(e.target.value)
                  }
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Expires At"
                type="datetime-local"
                value={userForm.sessionConfig.expiresAt ? new Date(userForm.sessionConfig.expiresAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => setUserForm({
                  ...userForm,
                  sessionConfig: {
                    ...userForm.sessionConfig,
                    expiresAt: e.target.value ? new Date(e.target.value) : null
                  }
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {editingUser && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userForm.isActive !== false}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                    />
                  }
                  label="Account Active"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setUserDialog(false);
            setEditingUser(null);
            resetUserForm();
          }}>
            Cancel
          </Button>
          <Button onClick={editingUser ? handleUpdateUser : handleCreateUser} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tenant Dialog */}
      <Dialog open={tenantDialog} onClose={() => {
        setTenantDialog(false);
        resetTenantForm();
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Tenant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Name"
                value={tenantForm.name}
                onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={tenantForm.description}
                onChange={(e) => setTenantForm({ ...tenantForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Users"
                type="number"
                value={tenantForm.settings.maxUsers}
                onChange={(e) => setTenantForm({
                  ...tenantForm,
                  settings: {
                    ...tenantForm.settings,
                    maxUsers: parseInt(e.target.value)
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Custom Models"
                type="number"
                value={tenantForm.settings.maxCustomModels}
                onChange={(e) => setTenantForm({
                  ...tenantForm,
                  settings: {
                    ...tenantForm.settings,
                    maxCustomModels: parseInt(e.target.value)
                  }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTenantDialog(false);
            resetTenantForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateTenant} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;