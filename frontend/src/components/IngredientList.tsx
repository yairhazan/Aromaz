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
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { Ingredient, IngredientFormData } from '../types/types';
import { DataGrid } from '@mui/x-data-grid';

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
  const theme = useTheme();

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
      const cleanFormData = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description,
        properties: formData.properties || '',
        notes: formData.notes || '',
        price_per_ml: Number(formData.price_per_ml),
        stock_amount: Number(formData.stock_amount),
        measurement_type: formData.measurement_type
      };

      if (editingId) {
        await api.updateIngredient(editingId, cleanFormData);
      } else {
        const response = await api.createIngredient(cleanFormData);
        setIngredients(prev => [...prev, response]);
      }
      handleClose();
      loadIngredients();
    } catch (error: any) {
      console.error('Error saving ingredient:', error);
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('already exists')) {
        alert('An ingredient with this name already exists. Please use a different name.');
      } else if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Failed to save ingredient. Please check all fields and try again.');
      }
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

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 150,
      flex: 0.8,
      minWidth: 120,
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 300,
      flex: 1.5,
      minWidth: 200,
      hide: true,
      hideable: true,
    },
    { 
      field: 'properties', 
      headerName: 'Properties', 
      width: 200,
      flex: 1,
      minWidth: 150,
      hide: true,
      hideable: true,
    },
    { 
      field: 'price_per_ml', 
      headerName: 'Price/ml', 
      width: 150,
      flex: 0.8,
      minWidth: 100,
    },
    { 
      field: 'stock_amount', 
      headerName: 'Stock', 
      width: 150,
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      flex: 0.5,
      minWidth: 100,
      renderCell: ({ row }: { row: Ingredient }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => handleOpen(row)} 
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleDelete(row.id)} 
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Container>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}15)`,
          borderRadius: '16px',
          mb: 4,
          overflow: 'hidden',
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
            Aromatherapy Ingredients
          </Typography>
          <Button
            variant="contained"
            onClick={(e: React.MouseEvent) => handleOpen()}
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
            Add Ingredient
          </Button>
        </Box>

        <Box sx={{ 
          height: 'calc(100vh - 300px)',
          minHeight: '400px',
          width: '100%',
          overflow: 'hidden',
        }}>
          <DataGrid
            rows={ingredients}
            columns={columns}
            paginationModel={{
              pageSize: 5,
              page: 0,
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              '& .MuiDataGrid-cell': {
                borderColor: theme.palette.divider,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.primary.light + '20',
                borderRadius: '8px 8px 0 0',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.secondary.light + '30',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px',
                },
              },
            }}
          />
        </Box>
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
          },
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.light + '20',
          color: theme.palette.primary.dark,
        }}>
          {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
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