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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import { Plus, Edit, Trash2, CalendarDays, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Holiday {
  _id: string;
  type: 'NATIONAL' | 'ORGANIZATIONAL' | 'WEEKLY';
  startDate: string;
  endDate?: string;
  name: string;
  active: boolean;
}

export default function HolidaysTab() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState({
    type: 'NATIONAL' as 'NATIONAL' | 'ORGANIZATIONAL' | 'WEEKLY',
    startDate: '',
    endDate: '',
    name: '',
    active: true,
  });

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
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/holidays', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHolidays(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch holidays error:', error);
      toast.error(error.message || 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Holiday name is required');
      return;
    }
    if (!formData.startDate) {
      toast.error('Start date is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const payload = {
        type: formData.type,
        name: formData.name,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        active: formData.active,
      };

      const url = editingHoliday
        ? `http://localhost:3000/time-management/holidays/${editingHoliday._id}`
        : 'http://localhost:3000/time-management/holidays';
      
      const response = await fetch(url, {
        method: editingHoliday ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save holiday');
      }

      toast.success(editingHoliday ? 'Holiday updated successfully!' : 'Holiday created successfully!');
      setDialogOpen(false);
      resetForm();
      fetchHolidays();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save holiday');
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      type: holiday.type,
      name: holiday.name,
      startDate: holiday.startDate ? holiday.startDate.split('T')[0] : '',
      endDate: holiday.endDate ? holiday.endDate.split('T')[0] : '',
      active: holiday.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/holidays/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete holiday');
      }

      toast.success('Holiday deleted successfully!');
      fetchHolidays();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete holiday');
    }
  };

  const resetForm = () => {
    setFormData({ type: 'NATIONAL', startDate: '', endDate: '', name: '', active: true });
    setEditingHoliday(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getTypeChip = (type: string) => {
    const typeStyles: Record<string, { bg: string; color: string }> = {
      NATIONAL: { bg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', color: 'white' },
      ORGANIZATIONAL: { bg: 'linear-gradient(135deg, #9333EA 0%, #A855F7 100%)', color: 'white' },
      WEEKLY: { bg: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', color: 'white' },
    };
    const style = typeStyles[type] || typeStyles.NATIONAL;
    return (
      <Chip
        label={type}
        size="small"
        sx={{
          background: style.bg,
          color: style.color,
          fontWeight: 600,
          borderRadius: 2,
        }}
      />
    );
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
      {/* Header - Orange/Red Theme */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Holidays
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage national, organizational, and weekly holidays
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
              Add Holiday
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
                  stroke: 'url(#gradientOrange)',
                },
              }}
            />
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FFF7ED' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                  {(canEdit || canDelete) && <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {holidays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(canEdit || canDelete) ? 6 : 5} align="center" sx={{ py: 8 }}>
                      <CalendarDays size={48} color="#FDBA74" style={{ marginBottom: 16 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748B', mb: 0.5 }}>
                        No holidays found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {canCreate ? 'Create one to get started.' : 'No holidays available.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  holidays.map((holiday) => (
                    <TableRow
                      key={holiday._id}
                      sx={{
                        '&:hover': {
                          bgcolor: '#FFF7ED',
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
                              background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
                              borderRadius: 2,
                            }}
                          >
                            <Calendar size={16} color="#EA580C" />
                          </Paper>
                          <Typography sx={{ fontWeight: 600 }}>{holiday.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getTypeChip(holiday.type)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(holiday.startDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {holiday.endDate ? new Date(holiday.endDate).toLocaleDateString() : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={holiday.active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            background: holiday.active
                              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                              : '#E2E8F0',
                            color: holiday.active ? 'white' : '#64748B',
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell align="right">
                          {canEdit && (
                            <IconButton
                              onClick={() => handleEdit(holiday)}
                              sx={{
                                color: '#EA580C',
                                '&:hover': {
                                  bgcolor: '#FED7AA',
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
                              onClick={() => handleDelete(holiday._id)}
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
            boxShadow: '0 20px 40px -10px rgba(234, 88, 12, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          {editingHoliday ? 'Edit' : 'Create'} Holiday
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Holiday Name"
                  placeholder="e.g., Christmas Day"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#EA580C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#EA580C',
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#EA580C' } }}>Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#EA580C',
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="NATIONAL">National</MenuItem>
                    <MenuItem value="ORGANIZATIONAL">Organizational</MenuItem>
                    <MenuItem value="WEEKLY">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#EA580C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#EA580C',
                    },
                  }}
                />
                <TextField
                  label="End Date (Optional)"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  helperText="Leave empty for single-day"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#EA580C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#EA580C',
                    },
                  }}
                />
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#FFF7ED',
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
                          color: '#EA580C',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          bgcolor: '#EA580C',
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
                background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #C2410C 0%, #B91C1C 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
                px: 4,
                borderRadius: 2,
              }}
            >
              {editingHoliday ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
