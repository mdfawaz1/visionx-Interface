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
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
    handleClose();
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
            }}
          >
            VisionX
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#90CAF9',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              position: 'relative',
              top: '-8px',
              opacity: 0.85,
            }}
          >
            (Beta 0.1.0)
          </Typography>
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'secondary.main',
              border: '2px solid #BBDEFB',
            }}>
              {userRole === 'admin' ? 'A' : 'U'}
            </Avatar>
          </IconButton>
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
          >
            <MenuItem disabled>
              {userRole === 'admin' ? 'Admin User' : 'Regular User'}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
