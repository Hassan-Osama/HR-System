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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleRule {
  _id: string;
  name: string;
  pattern: string;
  active: boolean;
}

export default function ScheduleRulesTab() {
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ScheduleRule | null>(null);
  const [formData, setFormData] = useState({ name: '', pattern: '', active: true });
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
    fetchScheduleRules();
  }, []);

  const fetchScheduleRules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/schedule-rules', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setScheduleRules(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch schedule rules error:', error);
      toast.error(error.message || 'Failed to fetch schedule rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    if (!formData.pattern.trim()) {
      toast.error('Pattern description is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const url = editingRule
        ? `http://localhost:3000/time-management/schedule-rules/${editingRule._id}`
        : 'http://localhost:3000/time-management/schedule-rules';
      
      const response = await fetch(url, {
        method: editingRule ? 'PATCH' : 'POST',
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

      toast.success(editingRule ? 'Schedule rule updated successfully!' : 'Schedule rule created successfully!');
      setDialogOpen(false);
      resetForm();
      fetchScheduleRules();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save schedule rule');
    }
  };

  const handleEdit = (rule: ScheduleRule) => {
    setEditingRule(rule);
    setFormData({ name: rule.name, pattern: rule.pattern, active: rule.active });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule rule?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/schedule-rules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete schedule rule');
      }

      toast.success('Schedule rule deleted successfully!');
      fetchScheduleRules();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete schedule rule');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', pattern: '', active: true });
    setEditingRule(null);
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
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Schedule Rules
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Define custom scheduling patterns
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
              Add Schedule Rule
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
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10B981" />
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
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Pattern</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                  {(canEdit || canDelete) && <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(canEdit || canDelete) ? 4 : 3} align="center" sx={{ py: 8 }}>
                      <Calendar size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748B', mb: 0.5 }}>
                        No schedule rules found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {canCreate ? 'Create one to get started.' : 'No schedule rules available.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  scheduleRules.map((rule) => (
                    <TableRow
                      key={rule._id}
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
                              background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                              borderRadius: 2,
                            }}
                          >
                            <Calendar size={16} color="#059669" />
                          </Paper>
                          <Typography sx={{ fontWeight: 600 }}>{rule.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 300 }}>
                          {rule.pattern}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rule.active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            background: rule.active
                              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                              : '#E2E8F0',
                            color: rule.active ? 'white' : '#64748B',
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell align="right">
                          {canEdit && (
                            <IconButton
                              onClick={() => handleEdit(rule)}
                              sx={{
                                color: '#059669',
                                '&:hover': {
                                  bgcolor: '#D1FAE5',
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
                              onClick={() => handleDelete(rule._id)}
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
            boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          {editingRule ? 'Edit' : 'Create'} Schedule Rule
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Rule Name"
                placeholder="e.g., Flexible Working Hours"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#059669',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#059669',
                  },
                }}
              />
              <TextField
                label="Pattern Description"
                placeholder="e.g., Core hours: 11 AM - 3 PM. Flex-in: 8-11 AM. Flex-out: 3-7 PM"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                required
                multiline
                rows={4}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#059669',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#059669',
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
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
                px: 4,
                borderRadius: 2,
              }}
            >
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
