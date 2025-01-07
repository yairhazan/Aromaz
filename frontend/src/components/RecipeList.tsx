import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Box,
  Chip,
  useTheme,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { Recipe, RecipeFormData, Ingredient, PackageBundle, RecipeIngredient } from '../types/types';

interface ExtendedRecipe extends Recipe {
  recipe_ingredients: Array<{
    ingredient: Ingredient;
    amount_ml: number;
  }>;
  package_bundle: PackageBundle;
}

const defaultFormData: RecipeFormData = {
  name: '',
  description: '',
  total_volume_ml: 30.0,
  retail_price: 0,
  notes: '',
  ingredients: [],
  package_bundle_id: 0,
};

export default function RecipeList() {
  const [recipes, setRecipes] = useState<ExtendedRecipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [packageBundles, setPackageBundles] = useState<PackageBundle[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RecipeFormData>(defaultFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipesData, ingredientsData, bundlesData] = await Promise.all([
        api.getRecipes(),
        api.getIngredients(),
        api.getPackageBundles(),
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
      setPackageBundles(bundlesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleOpen = (recipe?: ExtendedRecipe) => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description,
        total_volume_ml: recipe.total_volume_ml,
        retail_price: recipe.retail_price || 0,
        notes: recipe.notes || '',
        ingredients: recipe.recipe_ingredients.map(ri => ({
          ingredient_id: ri.ingredient.id,
          amount_ml: ri.amount_ml,
        })),
        package_bundle_id: recipe.package_bundle.id,
      });
      setEditingId(recipe.id);
    } else {
      setFormData(defaultFormData);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(defaultFormData);
    setEditingId(null);
    setSelectedIngredient(0);
    setSelectedAmount(0);
  };

  const validateForm = () => {
    if (!formData.name) return false;
    if (!formData.package_bundle_id) return false;
    if (formData.ingredients.length === 0) return false;
    if (formData.total_volume_ml <= 0) return false;
    return true;
  };

  const handleAddIngredient = () => {
    if (selectedIngredient && selectedAmount > 0) {
      const ingredient = ingredients.find(i => i.id === selectedIngredient);
      if (!ingredient) return;

      let amountInMl = selectedAmount;
      if (ingredient.measurement_type === 'drops' && ingredient.drops_per_ml) {
        amountInMl = selectedAmount / ingredient.drops_per_ml;
      }

      setFormData({
        ...formData,
        ingredients: [
          ...formData.ingredients,
          { ingredient_id: selectedIngredient, amount_ml: amountInMl }
        ]
      });
      
      setSelectedIngredient(0);
      setSelectedAmount(0);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name) {
        alert('Please enter a recipe name');
        return;
      }
      if (!formData.package_bundle_id) {
        alert('Please select a package bundle');
        return;
      }
      if (formData.ingredients.length === 0) {
        alert('Please add at least one ingredient');
        return;
      }
      if (formData.total_volume_ml <= 0) {
        alert('Total volume must be greater than 0');
        return;
      }

      if (editingId) {
        await api.updateRecipe(editingId, formData);
      } else {
        await api.createRecipe(formData);
      }
      handleClose();
      loadData();
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      alert(error.response?.data?.detail || 'Error saving recipe. Please check all fields and try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.deleteRecipe(id);
        loadData();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const getIngredientName = (id: number) => {
    return ingredients.find(i => i.id === id)?.name || 'Unknown';
  };

  const getSelectedPackageBundle = () => {
    return packageBundles.find(bundle => bundle.id === formData.package_bundle_id);
  };

  const getVolumeValidationMessage = () => {
    const selectedBundle = getSelectedPackageBundle();
    if (!selectedBundle) return '';
    
    if (formData.total_volume_ml > selectedBundle.capacity) {
      return `Warning: Recipe volume (${formData.total_volume_ml}ml) exceeds package capacity (${selectedBundle.capacity}ml)`;
    }
    return '';
  };

  return (
    <Container>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}15)`,
          borderRadius: '16px',
          mb: 4,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: theme.palette.primary.dark,
              fontWeight: 600,
            }}
          >
            Aromatherapy Recipes
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpen()}
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 1,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              boxShadow: '0 4px 12px rgba(74, 124, 89, 0.2)',
              alignSelf: { xs: 'stretch', sm: 'auto' },
            }}
          >
            Create New Recipe
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    {recipe.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {recipe.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: theme.palette.primary.main, 
                        mb: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      Ingredients:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5,
                      maxHeight: '80px',
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.light,
                        borderRadius: '2px',
                      },
                    }}>
                      {recipe.recipe_ingredients.map((ri) => (
                        <Chip
                          key={ri.ingredient.id}
                          label={`${ri.ingredient.name} (${ri.amount_ml}ml)`}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.primary.dark,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    onClick={() => handleOpen(recipe)}
                    startIcon={<EditIcon />}
                    sx={{
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '20',
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(recipe.id)}
                    startIcon={<DeleteIcon />}
                    sx={{
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: theme.palette.error.light + '20',
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            margin: { xs: 2, sm: 4 },
            maxHeight: 'calc(100% - 32px)',
            overflow: 'auto'
          },
        }}
      >
        <DialogTitle
          sx={{ 
            backgroundColor: theme.palette.primary.light + '20',
            color: theme.palette.primary.dark,
          }}
        >
          {editingId ? 'Edit Recipe' : 'Create New Recipe'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                error={!formData.name}
                helperText={!formData.name ? 'Name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Total Volume (ml)"
                type="number"
                value={formData.total_volume_ml}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  total_volume_ml: parseFloat(e.target.value) 
                })}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.1 }
                }}
                error={formData.total_volume_ml <= 0}
                helperText={formData.total_volume_ml <= 0 ? 'Total volume must be greater than 0' : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Retail Price"
                type="number"
                value={formData.retail_price}
                onChange={(e) => setFormData({ ...formData, retail_price: parseFloat(e.target.value) })}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                required
                label="Package Bundle"
                value={formData.package_bundle_id}
                onChange={(e) => setFormData({ ...formData, package_bundle_id: parseInt(e.target.value) })}
                margin="normal"
                error={!formData.package_bundle_id}
                helperText={!formData.package_bundle_id ? 'Please select a package bundle' : ''}
              >
                <MenuItem value={0}>Select a package bundle</MenuItem>
                {packageBundles.map((bundle) => (
                  <MenuItem 
                    key={bundle.id} 
                    value={bundle.id}
                    disabled={formData.total_volume_ml > bundle.capacity}
                  >
                    {bundle.name} ({bundle.capacity}ml) - ${bundle.total_price.toFixed(2)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Ingredient"
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(parseInt(e.target.value))}
                  >
                    <MenuItem value={0}>Select an ingredient</MenuItem>
                    {ingredients.map((ingredient) => (
                      <MenuItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} (${ingredient.price_per_ml?.toFixed(2)}/ml)
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label={`Amount (${selectedIngredient ? ingredients.find(i => i.id === selectedIngredient)?.measurement_type : 'ml'})`}
                    type="number"
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0, step: 0.1 }
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddIngredient}
                    disabled={!selectedIngredient || selectedAmount <= 0}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <List>
                {formData.ingredients.map((ing, index) => {
                  const ingredient = ingredients.find(i => i.id === ing.ingredient_id);
                  const displayAmount = ingredient?.measurement_type === 'drops' && ingredient.drops_per_ml
                    ? Math.round(ing.amount_ml * ingredient.drops_per_ml)
                    : ing.amount_ml;
                  return (
                    <ListItem key={index}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                          <ListItemText
                            primary={ingredient?.name || 'Unknown'}
                            secondary={`$${((ingredient?.price_per_ml || 0) * ing.amount_ml).toFixed(2)}`}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            type="number"
                            value={displayAmount}
                            onChange={(e) => {
                              const newAmount = parseFloat(e.target.value);
                              if (newAmount >= 0) {
                                const newIngredients = [...formData.ingredients];
                                let amountInMl = newAmount;
                                if (ingredient?.measurement_type === 'drops' && ingredient.drops_per_ml) {
                                  amountInMl = newAmount / ingredient.drops_per_ml;
                                }
                                newIngredients[index] = {
                                  ...ing,
                                  amount_ml: amountInMl
                                };
                                setFormData({
                                  ...formData,
                                  ingredients: newIngredients
                                });
                              }
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">
                                {ingredient?.measurement_type || 'ml'}
                              </InputAdornment>,
                              inputProps: { min: 0, step: 0.1 }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton edge="end" onClick={() => handleRemoveIngredient(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!validateForm()}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 