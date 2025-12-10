'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ShiftType {
  _id: string;
  name: string;
  active: boolean;
}

export default function ShiftTypesTab() {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShiftType, setEditingShiftType] = useState<ShiftType | null>(null);
  const [formData, setFormData] = useState({ name: '', active: true });
  const [userRole, setUserRole] = useState<string>('');

  // Role-based permissions
  const isAdmin = ['System Admin', 'HR Admin'].includes(userRole);
  const isHRManager = ['HR Manager'].includes(userRole);
  const canCreate = isAdmin || isHRManager;
  const canEdit = isAdmin || isHRManager;
  const canDelete = isAdmin || isHRManager;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role) setUserRole(user.role);
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }
    fetchShiftTypes();
  }, []);

  const fetchShiftTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/shift-types', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShiftTypes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch shift types error:', error);
      toast.error(error.message || 'Failed to fetch shift types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Shift type name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const url = editingShiftType
        ? `http://localhost:3000/time-management/shift-types/${editingShiftType._id}`
        : 'http://localhost:3000/time-management/shift-types';
      
      const response = await fetch(url, {
        method: editingShiftType ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save shift type');
      }

      toast.success(editingShiftType ? 'Shift type updated successfully!' : 'Shift type created successfully!');
      setDialogOpen(false);
      resetForm();
      fetchShiftTypes();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save shift type');
    }
  };

  const handleEdit = (shiftType: ShiftType) => {
    setEditingShiftType(shiftType);
    setFormData({ name: shiftType.name, active: shiftType.active });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift type?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/shift-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete shift type');
      }

      toast.success('Shift type deleted successfully!');
      fetchShiftTypes();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete shift type');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', active: true });
    setEditingShiftType(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Shift Types
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage different types of work shifts
            </Typography>
          </Box>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                borderRadius: 2,
                px: 3,
              }}
            >
              Add Shift Type
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress
              sx={{
                '& .MuiCircularProgress-circle': {
                  stroke: 'url(#gradient)',
                },
              }}
            />
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                  {(canEdit || canDelete) && <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {shiftTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(canEdit || canDelete) ? 3 : 2} align="center" sx={{ py: 8 }}>
                      <Clock size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748B', mb: 0.5 }}>
                        No shift types found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {canCreate ? 'Create one to get started.' : 'No shift types available.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftTypes.map((shiftType) => (
                    <TableRow
                      key={shiftType._id}
                      sx={{
                        '&:hover': {
                          bgcolor: '#F1F5F9',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1,
                              background: 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)',
                              borderRadius: 2,
                            }}
                          >
                            <Clock size={16} color="#2563EB" />
                          </Paper>
                          <Typography sx={{ fontWeight: 600 }}>{shiftType.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={shiftType.active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            background: shiftType.active
                              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                              : '#E2E8F0',
                            color: shiftType.active ? 'white' : '#64748B',
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell align="right">
                          {canEdit && (
                            <IconButton
                              onClick={() => handleEdit(shiftType)}
                              sx={{
                                color: '#2563EB',
                                '&:hover': {
                                  bgcolor: '#DBEAFE',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                                mr: 1,
                              }}
                            >
                              <Edit size={18} />
                            </IconButton>
                          )}
                          {canDelete && (
                            <IconButton
                              onClick={() => handleDelete(shiftType._id)}
                              sx={{
                                color: '#DC2626',
                                '&:hover': {
                                  bgcolor: '#FEE2E2',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          {editingShiftType ? 'Edit' : 'Create'} Shift Type
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Shift Type Name"
                placeholder="e.g., Normal Day Shift (9-5)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563EB',
                  },
                }}
              />
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#F8FAFC',
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#10B981',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          bgcolor: '#10B981',
                        },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontWeight: 600 }}>Active Status</Typography>}
                />
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              sx={{
                color: '#64748B',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
                px: 4,
                borderRadius: 2,
              }}
            >
              {editingShiftType ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
