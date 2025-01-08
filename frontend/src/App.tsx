import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Toolbar } from '@mui/material';
import Home from './components/Home';
import IngredientList from './components/IngredientList';
import RecipeList from './components/RecipeList';
import PackagingList from './components/PackagingList';
import SignIn from './components/auth/SignIn';
import Register from './components/auth/Register';
import Header from './components/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';

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

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/signin" />;
};

function App() {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            maxWidth: '100vw',
            overflow: 'hidden'
          }}>
            <Header />
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
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  } />
                  <Route path="/ingredients" element={
                    <PrivateRoute>
                      <IngredientList />
                    </PrivateRoute>
                  } />
                  <Route path="/recipes" element={
                    <PrivateRoute>
                      <RecipeList />
                    </PrivateRoute>
                  } />
                  <Route path="/packaging" element={
                    <PrivateRoute>
                      <PackagingList />
                    </PrivateRoute>
                  } />
                </Routes>
              </Box>
            </Container>
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
