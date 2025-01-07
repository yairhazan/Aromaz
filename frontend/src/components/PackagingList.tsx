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
  Chip,
  Box,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { PackagingItem, PackageBundle, PackageBundleCreate } from '../types/types';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface PackagingItemFormData {
  name: string;
  type: string;
  description: string;
  price: number;
  stock_amount: number;
  capacity: number | null;
  color: string;
  material: string;
  notes: string;
}

interface PackageBundleFormData {
  name: string;
  description: string;
  capacity: number;
  notes: string;
  item_ids: number[];
}

const defaultPackagingItemForm: PackagingItemFormData = {
  name: '',
  type: '',
  description: '',
  price: 0,
  stock_amount: 0,
  capacity: null,
  color: '',
  material: '',
  notes: ''
};

const defaultPackageBundleForm: PackageBundleFormData = {
  name: '',
  description: '',
  capacity: 0,
  notes: '',
  item_ids: []
};

const packagingTypes = [
  'Bottle',
  'Cap',
  'Label',
  'Box',
  'Dropper',
  'Roll-on',
  'Spray',
  'Other'
];

const materials = [
  'Glass',
  'Plastic',
  'Paper',
  'Metal',
  'Wood',
  'Stainless Steel',
  'Aluminum',
  'Other'
];

export default function PackagingList() {
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [packageBundles, setPackageBundles] = useState<PackageBundle[]>([]);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [itemForm, setItemForm] = useState<PackagingItemFormData>(defaultPackagingItemForm);
  const [bundleForm, setBundleForm] = useState<PackageBundleFormData>(defaultPackageBundleForm);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingBundleId, setEditingBundleId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'bundles'>('items');
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 150 
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      flex: 0.8,
      minWidth: 120 
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1.5,
      minWidth: 200 
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      field: 'stock_amount', 
      headerName: 'Stock', 
      flex: 0.8,
      minWidth: 100 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={() => handleOpenItemDialog(params.row)}
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
            onClick={() => handleDeleteItem(params.row.id)}
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
        </Box>
      ),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [items, bundles] = await Promise.all([
        api.getPackagingItems(),
        api.getPackageBundles(),
      ]);
      setPackagingItems(items);
      setPackageBundles(bundles);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleOpenItemDialog = (item?: PackagingItem) => {
    if (item) {
      setItemForm({
        name: item.name,
        type: item.type,
        description: item.description,
        price: item.price,
        stock_amount: item.stock_amount,
        capacity: item.capacity || null,
        color: item.color || '',
        material: item.material,
        notes: item.notes || ''
      });
      setEditingItemId(item.id);
    } else {
      setItemForm(defaultPackagingItemForm);
      setEditingItemId(null);
    }
    setItemDialogOpen(true);
  };

  const handleOpenBundleDialog = (bundle?: PackageBundle) => {
    if (bundle) {
      setBundleForm({
        name: bundle.name,
        description: bundle.description,
        capacity: bundle.capacity,
        notes: bundle.notes || '',
        item_ids: bundle.items.map(item => item.id)
      });
      setEditingBundleId(bundle.id);
    } else {
      setBundleForm(defaultPackageBundleForm);
      setEditingBundleId(null);
    }
    setBundleDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setItemForm(defaultPackagingItemForm);
    setEditingItemId(null);
  };

  const handleCloseBundleDialog = () => {
    setBundleDialogOpen(false);
    setBundleForm(defaultPackageBundleForm);
    setEditingBundleId(null);
  };

  const handleSubmitItem = async () => {
    try {
      const submitData: Omit<PackagingItem, 'id'> = {
        name: itemForm.name,
        type: itemForm.type,
        description: itemForm.description,
        price: itemForm.price,
        stock_amount: itemForm.stock_amount,
        material: itemForm.material,
        capacity: itemForm.capacity || undefined,
        color: itemForm.color || undefined,
        notes: itemForm.notes || undefined
      };

      if (editingItemId) {
        await api.updatePackagingItem(editingItemId, submitData);
      } else {
        await api.createPackagingItem(submitData);
      }
      handleCloseItemDialog();
      loadData();
    } catch (error) {
      console.error('Error saving packaging item:', error);
    }
  };

  const handleSubmitBundle = async () => {
    try {
      const submitData: PackageBundleCreate = {
        name: bundleForm.name,
        description: bundleForm.description,
        capacity: bundleForm.capacity,
        notes: bundleForm.notes || undefined,
        item_ids: bundleForm.item_ids
      };

      if (editingBundleId) {
        await api.updatePackageBundle(editingBundleId, submitData);
      } else {
        await api.createPackageBundle(submitData);
      }
      handleCloseBundleDialog();
      loadData();
    } catch (error) {
      console.error('Error saving package bundle:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this packaging item?')) {
      try {
        await api.deletePackagingItem(id);
        loadData();
      } catch (error) {
        console.error('Error deleting packaging item:', error);
      }
    }
  };

  const handleDeleteBundle = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this package bundle?')) {
      try {
        await api.deletePackageBundle(id);
        loadData();
      } catch (error) {
        console.error('Error deleting package bundle:', error);
      }
    }
  };

  const calculateBundlePrice = (itemIds: number[]) => {
    return itemIds.reduce((total, id) => {
      const item = packagingItems.find(i => i.id === id);
      return total + (item?.price || 0);
    }, 0);
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
            Packaging Solutions
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={() => setActiveTab('items')}
              sx={{
                borderRadius: '20px',
                px: 3,
                py: { xs: 1, sm: 1.5 },
                backgroundColor: activeTab === 'items' ? theme.palette.primary.main : theme.palette.secondary.main,
                color: activeTab === 'items' ? 'white' : theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: activeTab === 'items' ? theme.palette.primary.dark : theme.palette.secondary.dark,
                },
                boxShadow: '0 4px 12px rgba(74, 124, 89, 0.2)',
                width: '100%',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Packaging Items
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={() => setActiveTab('bundles')}
              sx={{
                borderRadius: '20px',
                px: 3,
                py: { xs: 1, sm: 1.5 },
                backgroundColor: activeTab === 'bundles' ? theme.palette.primary.main : theme.palette.secondary.main,
                color: activeTab === 'bundles' ? 'white' : theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: activeTab === 'bundles' ? theme.palette.primary.dark : theme.palette.secondary.dark,
                },
                boxShadow: '0 4px 12px rgba(74, 124, 89, 0.2)',
                width: '100%',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Package Bundles
            </Button>
          </Grid>
        </Grid>

        {activeTab === 'items' ? (
          <>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 3
            }}>
              <Typography 
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                }}
              >
                Packaging Items
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenItemDialog()}
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
                Add Item
              </Button>
            </Box>
            <Box sx={{ 
              height: 500,
              width: '100%',
              '& .MuiDataGrid-root': {
                border: 'none',
                backgroundColor: 'transparent',
              },
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
              '& .MuiDataGrid-footer': {
                borderTop: `1px solid ${theme.palette.divider}`,
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
            }}>
              <DataGrid
                rows={packagingItems}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                pagination
                autoHeight
                disableRowSelectionOnClick
                getRowHeight={() => 'auto'}
                rowCount={packagingItems.length}
                paginationMode="client"
                density="comfortable"
                sx={{
                  '& .MuiDataGrid-cell': {
                    py: 1,
                    px: 2,
                    whiteSpace: 'normal',
                    minHeight: '48px !important',
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 3
            }}>
              <Typography 
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                }}
              >
                Package Bundles
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenBundleDialog()}
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
                Create Bundle
              </Button>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {packageBundles.map((bundle) => (
                <Grid item xs={12} sm={6} md={4} key={bundle.id}>
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
                        {bundle.name}
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
                        {bundle.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                          Items:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {bundle.items.map((item) => (
                            <Chip
                              key={item.id}
                              label={item.name}
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.secondary.light,
                                color: theme.palette.primary.dark,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0, justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        onClick={() => handleOpenBundleDialog(bundle)}
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
                        onClick={() => handleDeleteBundle(bundle.id)}
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
          </>
        )}
      </Paper>

      <Dialog
        open={itemDialogOpen}
        onClose={handleCloseItemDialog}
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
          {editingItemId ? 'Edit Packaging Item' : 'Add New Packaging Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                required
                label="Type"
                value={itemForm.type}
                onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                margin="normal"
              >
                {packagingTypes.map((type) => (
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
                label="Material"
                value={itemForm.material}
                onChange={(e) => setItemForm({ ...itemForm, material: e.target.value })}
                margin="normal"
              >
                {materials.map((material) => (
                  <MenuItem key={material} value={material}>
                    {material}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Price"
                type="number"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
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
                label="Stock Amount"
                type="number"
                value={itemForm.stock_amount}
                onChange={(e) => setItemForm({ ...itemForm, stock_amount: parseInt(e.target.value) })}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Capacity (ml)"
                type="number"
                value={itemForm.capacity || ''}
                onChange={(e) => setItemForm({ ...itemForm, capacity: parseFloat(e.target.value) })}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Color"
                value={itemForm.color}
                onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={itemForm.notes}
                onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitItem}
            variant="contained"
            color="primary"
            disabled={!itemForm.name || !itemForm.type || !itemForm.material}
          >
            {editingItemId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bundleDialogOpen}
        onClose={handleCloseBundleDialog}
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
          {editingBundleId ? 'Edit Package Bundle' : 'Create New Package Bundle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={bundleForm.name}
                onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={bundleForm.description}
                onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Capacity (ml)"
                type="number"
                value={bundleForm.capacity}
                onChange={(e) => setBundleForm({ ...bundleForm, capacity: parseFloat(e.target.value) })}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Total Price"
                type="number"
                value={calculateBundlePrice(bundleForm.item_ids)}
                InputProps={{
                  startAdornment: '$',
                  readOnly: true
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Items:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {packagingItems.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    onClick={() => {
                      const newIds = bundleForm.item_ids.includes(item.id)
                        ? bundleForm.item_ids.filter(id => id !== item.id)
                        : [...bundleForm.item_ids, item.id];
                      setBundleForm({ ...bundleForm, item_ids: newIds });
                    }}
                    color={bundleForm.item_ids.includes(item.id) ? "primary" : "default"}
                    variant={bundleForm.item_ids.includes(item.id) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={bundleForm.notes}
                onChange={(e) => setBundleForm({ ...bundleForm, notes: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBundleDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitBundle}
            variant="contained"
            color="primary"
            disabled={!bundleForm.name || bundleForm.capacity <= 0 || bundleForm.item_ids.length === 0}
          >
            {editingBundleId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 