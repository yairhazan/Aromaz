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
  Divider,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { PackagingItem, PackageBundle } from '../types/types';

const defaultPackagingItemForm = {
  name: '',
  type: '',
  description: '',
  price: 0,
  stock_amount: 0,
  capacity: undefined,
  color: '',
  material: '',
  notes: '',
};

const defaultPackageBundleForm = {
  name: '',
  description: '',
  capacity: 0,
  notes: '',
  item_ids: [] as number[],
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
  const [itemForm, setItemForm] = useState(defaultPackagingItemForm);
  const [bundleForm, setBundleForm] = useState(defaultPackageBundleForm);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingBundleId, setEditingBundleId] = useState<number | null>(null);

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
      setItemForm({ ...item });
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
        ...bundle,
        item_ids: bundle.items.map(item => item.id),
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
      if (editingItemId) {
        await api.updatePackagingItem(editingItemId, itemForm);
      } else {
        await api.createPackagingItem(itemForm);
      }
      handleCloseItemDialog();
      loadData();
    } catch (error) {
      console.error('Error saving packaging item:', error);
    }
  };

  const handleSubmitBundle = async () => {
    try {
      if (editingBundleId) {
        await api.updatePackageBundle(editingBundleId, bundleForm);
      } else {
        await api.createPackageBundle(bundleForm);
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Packaging Management</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenItemDialog()}
                sx={{ mr: 2 }}
              >
                Add Packaging Item
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenBundleDialog()}
              >
                Create Bundle
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Packaging Items Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Packaging Items
          </Typography>
          <Grid container spacing={2}>
            {packagingItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Type: {item.type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {item.description}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      <Chip label={`$${item.price.toFixed(2)}`} color="primary" />
                      <Chip label={`Stock: ${item.stock_amount}`} />
                      {item.capacity && (
                        <Chip label={`${item.capacity}ml`} />
                      )}
                      {item.material && (
                        <Chip label={item.material} variant="outlined" />
                      )}
                      {item.color && (
                        <Chip label={item.color} variant="outlined" />
                      )}
                    </Box>
                    {item.notes && (
                      <Typography variant="body2" color="textSecondary">
                        Notes: {item.notes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleOpenItemDialog(item)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Package Bundles Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Package Bundles
          </Typography>
          <Grid container spacing={2}>
            {packageBundles.map((bundle) => (
              <Grid item xs={12} sm={6} md={4} key={bundle.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {bundle.name}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {bundle.description}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      <Chip label={`$${bundle.total_price.toFixed(2)}`} color="primary" />
                      <Chip label={`${bundle.capacity}ml`} />
                    </Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Included Items:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {bundle.items.map((item) => (
                        <Chip
                          key={item.id}
                          label={item.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {bundle.notes && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Notes: {bundle.notes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleOpenBundleDialog(bundle)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteBundle(bundle.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Packaging Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
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

      {/* Package Bundle Dialog */}
      <Dialog open={bundleDialogOpen} onClose={handleCloseBundleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
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