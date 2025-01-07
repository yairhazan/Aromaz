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
      main: '#4a90e2',
    },
    secondary: {
      main: '#82c91e',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                AromaDB
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/ingredients"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transition: 'background-color 0.3s'
                    }
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
                      transition: 'background-color 0.3s'
                    }
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
                      transition: 'background-color 0.3s'
                    }
                  }}
                >
                  Packaging
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* This empty Toolbar creates space below the fixed AppBar */}
          <Container 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              pt: 3, 
              pb: 4,
              backgroundColor: '#f5f5f5'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ingredients" element={<IngredientList />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/packaging" element={<PackagingList />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
