import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { firestoreService, COLLECTIONS } from '../services/firestore';

interface Ingredient {
  id?: string;
  name: string;
  type: string;
  measurementUnit: string;
  stockQuantity: number;
  costPerUnit: number;
  notes?: string;
}

const INGREDIENT_TYPES = ['essential_oil', 'carrier_oil', 'other'];
const MEASUREMENT_UNITS = ['ml', 'drops'];

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState<Ingredient>({
    name: '',
    type: 'essential_oil',
    measurementUnit: 'ml',
    stockQuantity: 0,
    costPerUnit: 0,
    notes: ''
  });

  const loadIngredients = async () => {
    try {
      const data = await firestoreService.getAll<Ingredient>(COLLECTIONS.INGREDIENTS);
      setIngredients(data);
    } catch (err) {
      setError('Failed to load ingredients');
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleOpen = (ingredient?: Ingredient) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData(ingredient);
    } else {
      setEditingIngredient(null);
      setFormData({
        name: '',
        type: 'essential_oil',
        measurementUnit: 'ml',
        stockQuantity: 0,
        costPerUnit: 0,
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIngredient(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingIngredient?.id) {
        await firestoreService.update(COLLECTIONS.INGREDIENTS, editingIngredient.id, formData);
        setSuccess('Ingredient updated successfully');
      } else {
        await firestoreService.create(COLLECTIONS.INGREDIENTS, formData);
        setSuccess('Ingredient created successfully');
      }
      handleClose();
      loadIngredients();
    } catch (err) {
      setError('Failed to save ingredient');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await firestoreService.delete(COLLECTIONS.INGREDIENTS, id);
      setSuccess('Ingredient deleted successfully');
      loadIngredients();
    } catch (err) {
      setError('Failed to delete ingredient');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Ingredients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Ingredient
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Cost/Unit</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.type}</TableCell>
                <TableCell>{ingredient.stockQuantity} {ingredient.measurementUnit}</TableCell>
                <TableCell>${ingredient.costPerUnit}</TableCell>
                <TableCell>{ingredient.notes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(ingredient)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => ingredient.id && handleDelete(ingredient.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingIngredient ? 'Edit Ingredient' : 'Add Ingredient'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {INGREDIENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Measurement Unit"
            fullWidth
            value={formData.measurementUnit}
            onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
          >
            {MEASUREMENT_UNITS.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Stock Quantity"
            type="number"
            fullWidth
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Cost per Unit"
            type="number"
            fullWidth
            value={formData.costPerUnit}
            onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingIngredient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default IngredientList; 