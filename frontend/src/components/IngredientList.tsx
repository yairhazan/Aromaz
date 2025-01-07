import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { Ingredient, IngredientFormData } from '../types/types';

const ingredientTypes = [
  'Essential Oil',
  'Carrier Oil',
  'Hydrosol',
  'Absolute',
  'CO2 Extract',
  'Other'
];

const defaultFormData: IngredientFormData = {
  name: '',
  type: '',
  description: '',
  properties: '',
  notes: '',
  price_per_ml: 0,
  stock_amount: 0,
  measurement_type: 'ml',
};

export default function IngredientList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IngredientFormData>(defaultFormData);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const data = await api.getIngredients();
      setIngredients(data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
    }
  };

  const handleOpen = (ingredient?: Ingredient) => {
    if (ingredient) {
      setFormData(ingredient);
      setEditingId(ingredient.id);
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
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.updateIngredient(editingId, formData);
      } else {
        await api.createIngredient(formData);
      }
      handleClose();
      loadIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await api.deleteIngredient(id);
        loadIngredients();
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Aromatherapy Ingredients
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: '20px' }}
      >
        Add New Ingredient
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Properties</TableCell>
              <TableCell>Price/ml</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.type}</TableCell>
                <TableCell>{ingredient.description}</TableCell>
                <TableCell>{ingredient.properties}</TableCell>
                <TableCell>${ingredient.price_per_ml?.toFixed(2)}</TableCell>
                <TableCell>{ingredient.stock_amount}ml</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(ingredient)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(ingredient.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                required
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                margin="normal"
              >
                {ingredientTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                required
                label="Measurement Type"
                value={formData.measurement_type}
                onChange={(e) => setFormData({ ...formData, measurement_type: e.target.value as 'ml' | 'drops' })}
                margin="normal"
              >
                <MenuItem value="ml">Milliliters (ml)</MenuItem>
                <MenuItem value="drops">Drops</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label={`Price per ${formData.measurement_type}`}
                type="number"
                value={formData.price_per_ml}
                onChange={(e) => setFormData({ ...formData, price_per_ml: parseFloat(e.target.value) })}
                margin="normal"
                InputProps={{
                  startAdornment: '$',
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label={`Stock Amount (${formData.measurement_type})`}
                type="number"
                value={formData.stock_amount}
                onChange={(e) => setFormData({ ...formData, stock_amount: parseInt(e.target.value) })}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 