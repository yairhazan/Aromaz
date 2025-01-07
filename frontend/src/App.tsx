import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Container, Box } from '@mui/material';
import Home from './components/Home';
import IngredientList from './components/IngredientList';
import RecipeList from './components/RecipeList';
import PackagingList from './components/PackagingList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a7c59', // Sage green
      light: '#729b79',
      dark: '#2c5530',
    },
    secondary: {
      main: '#d4c8be', // Beige
      light: '#e8e0d9',
      dark: '#b2a79d',
    },
    background: {
      default: '#f5f2ef', // Light beige
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e2e', // Dark green
      secondary: '#5c6c5e',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(74, 124, 89, 0.95)', // Semi-transparent sage green
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '6px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}>
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
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 },
                overflow: 'auto',
                maxWidth: 'calc(100vw - 150px)',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
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
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Container 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              pt: { xs: 2, sm: 3, md: 4 }, 
              pb: { xs: 4, sm: 5, md: 6 },
              px: { xs: 2, sm: 3, md: 4 },
              backgroundColor: 'transparent',
              maxWidth: '100%',
              overflow: 'auto'
            }}
            maxWidth={false}
          >
            <Box sx={{ 
              maxWidth: '1600px', 
              mx: 'auto',
              width: '100%'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ingredients" element={<IngredientList />} />
                <Route path="/recipes" element={<RecipeList />} />
                <Route path="/packaging" element={<PackagingList />} />
              </Routes>
            </Box>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
