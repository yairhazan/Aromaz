import { Container, Typography, Button, Grid, Paper, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeafIcon from '@mui/icons-material/Spa';
import RecipeIcon from '@mui/icons-material/MenuBook';
import PackageIcon from '@mui/icons-material/Inventory';

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        minHeight: 'calc(100vh - 100px)',
        py: { xs: 4, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}15)`,
            borderRadius: '24px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 3,
            }}
          >
            Welcome to AromaDB
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
            }}
          >
            Your comprehensive database for aromatherapy ingredients, recipes, and
            packaging solutions. Create beautiful blends with confidence using our curated
            collection of resources.
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: theme.palette.background.paper,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <LeafIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.dark, fontWeight: 600 }}>
                Natural Ingredients
              </Typography>
              <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                Explore our comprehensive database of essential oils and natural ingredients.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/ingredients')}
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Explore
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: theme.palette.background.paper,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <RecipeIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.dark, fontWeight: 600 }}>
                Blend Recipes
              </Typography>
              <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                Discover and create harmonious aromatherapy blends with our recipe collection.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/recipes')}
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Explore
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: theme.palette.background.paper,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <PackageIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.dark, fontWeight: 600 }}>
                Packaging Solutions
              </Typography>
              <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                Find the perfect packaging for your aromatherapy products.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/packaging')}
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Explore
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}30)`,
            borderRadius: '24px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Start Your Aromatherapy Journey
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            Whether you're a beginner or an experienced aromatherapist, our tools will help you create perfect blends for any purpose.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/ingredients')}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
