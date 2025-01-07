import { Box, Typography, Paper, Grid, Card, CardContent, useTheme, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Natural Ingredients',
      description: 'Explore our comprehensive database of essential oils and natural ingredients.',
      icon: '🌿',
      link: '/ingredients'
    },
    {
      title: 'Blend Recipes',
      description: 'Discover and create harmonious aromatherapy blends with our recipe collection.',
      icon: '🧪',
      link: '/recipes'
    },
    {
      title: 'Packaging Solutions',
      description: 'Find the perfect packaging for your aromatherapy products.',
      icon: '📦',
      link: '/packaging'
    }
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}40)`,
          borderRadius: '24px',
          mb: 6,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Welcome to AromaDB
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Your comprehensive database for aromatherapy ingredients, recipes, and packaging solutions.
          Create beautiful blends with confidence using our curated collection of resources.
        </Typography>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}15)`,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Typography variant="h2" sx={{ mb: 2, fontSize: '3rem' }}>
                  {feature.icon}
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.dark,
                    fontWeight: 600
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    color: theme.palette.text.secondary
                  }}
                >
                  {feature.description}
                </Typography>
                <Button
                  component={Link}
                  to={feature.link}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }
                  }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${theme.palette.secondary.light}30, ${theme.palette.primary.light}15)`,
          borderRadius: '16px',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.dark }}>
          Start Your Aromatherapy Journey
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          Whether you're a beginner or an experienced aromatherapist,
          our tools will help you create perfect blends for any purpose.
        </Typography>
        <Button
          component={Link}
          to="/ingredients"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(74, 124, 89, 0.2)',
          }}
        >
          Get Started
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
