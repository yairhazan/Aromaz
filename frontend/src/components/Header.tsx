import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleClose();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 2, sm: 4 },
        minHeight: { xs: '56px', sm: '64px' }
      }}>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{ 
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          🌿 AromaDB
        </Typography>

        {currentUser ? (
          <>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ 
                display: 'flex',
                gap: { xs: 1, sm: 2 }
              }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/ingredients"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                    },
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  Ingredients
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/recipes"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                    },
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  Recipes
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/packaging"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                    },
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  Packaging
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Hello, {currentUser.displayName || 'User'}
                </Typography>
                <IconButton
                  onClick={handleMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={currentUser.displayName || 'User'}
                    src={currentUser.photoURL || undefined}
                    sx={{ 
                      width: 35, 
                      height: 35,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  />
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
                  <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/signin"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                textTransform: 'none',
                borderRadius: '20px'
              }}
            >
              Sign In
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
                textTransform: 'none',
                borderRadius: '20px'
              }}
            >
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 