
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to AromaDB
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          Your Aromatherapy Recipe Management System
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Typography paragraph>
                Manage your essential oils, carrier oils, and other aromatherapy ingredients.
              </Typography>
              <Button component={Link} to="/ingredients" variant="contained" color="primary">
                View Ingredients
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Recipes
              </Typography>
              <Typography paragraph>
                Create and manage your aromatherapy blend recipes.
              </Typography>
              <Button component={Link} to="/recipes" variant="contained" color="primary">
                View Recipes
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Packaging
              </Typography>
              <Typography paragraph>
                Organize your packaging materials and bundles.
              </Typography>
              <Button component={Link} to="/packaging" variant="contained" color="primary">
                View Packaging
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
