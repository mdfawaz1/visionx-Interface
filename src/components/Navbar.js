// src/components/TopNavBar.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AccountCircle,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };

  const handleUserManagement = () => {
    navigate('/user-management');
    handleClose();
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'master':
        return <AdminIcon />;
      case 'admin':
        return <SecurityIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'master':
        return 'error';
      case 'admin':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getAvatarText = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #0d47a1, #1e88e5)',
        boxShadow: '0px 4px 10px rgba(0, 0, 139, 0.6)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontWeight: 'bold',
              color: '#BBDEFB',
              textShadow: '0px 0px 8px rgba(0, 174, 239, 1)',
              letterSpacing: '0.15em',
              fontSize: '1.5rem',
              marginRight: '6px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            VisionX
          </Typography>
        </Box>

        {/* User Menu */}
        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Tenant Info */}
            {user.tenantName && (
              <Chip
                icon={<BusinessIcon />}
                label={user.tenantName}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
            
            {/* User Avatar and Menu */}
            <Tooltip title={`${user.username} (${user.role})`}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: `${getRoleColor()}.main`,
                    border: '2px solid #BBDEFB',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {getAvatarText()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 250,
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Chip
                  icon={getRoleIcon()}
                  label={user.role.toUpperCase()}
                  color={getRoleColor()}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              <Divider />
              
              {user.permissions?.canManageUsers && (
                <MenuItem onClick={handleUserManagement}>
                  <ListItemIcon>
                    <AdminIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>User Management</ListItemText>
                </MenuItem>
              )}
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;