import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Avatar, AppBar, Toolbar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            {isHomePage ? 'Admin Panel' : 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              onClick={handleMenu}
              sx={{
                bgcolor: '#9333ea',
                cursor: 'pointer'
              }}
            >
              {user?.username ? user.username[0].toUpperCase() : 'A'}
            </Avatar>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;