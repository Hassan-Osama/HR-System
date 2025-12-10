'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
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
} from '@mui/material';
import { Plus, Edit, Trash2, Users, User, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface ShiftAssignment {
  _id: string;
  employeeId?: { _id: string; firstName: string; lastName: string; employeeNumber: string };
  departmentId?: { _id: string; name: string };
  positionId?: { _id: string; title: string };
  shiftId?: { _id: string; name: string };
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'EXPIRED';
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface ShiftType {
  _id: string;
  name: string;
}

export default function ShiftAssignmentsTab() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ShiftAssignment | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    startDate: '',
    endDate: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED',
  });

  // Role-based permissions
  const isAdmin = ['System Admin', 'HR Admin'].includes(userRole);
  const isHRManager = ['HR Manager'].includes(userRole);
  const isManager = ['Department Head', 'Line Manager'].includes(userRole);
  const isEmployee = !isAdmin && !isHRManager && !isManager;
  
  // Who can do what
  const canCreate = isAdmin || isHRManager;
  const canEdit = isAdmin || isHRManager;
  const canDelete = isAdmin || isHRManager;
  const canChangeStatus = isAdmin || isHRManager || isManager;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.userId) setUserId(user.userId);
        if (user.role) setUserRole(user.role);
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [assignmentsRes, employeesRes, shiftTypesRes] = await Promise.all([
        fetch('http://localhost:3000/time-management/shifts', { headers }),
        fetch('http://localhost:3000/api/employee-profile', { headers }),
        fetch('http://localhost:3000/time-management/shift-types', { headers }),
      ]);

      if (!assignmentsRes.ok || !employeesRes.ok || !shiftTypesRes.ok) {
        throw new Error('Failed to fetch required data');
      }

      const assignmentsData = await assignmentsRes.json();
      const employeesData = await employeesRes.json();
      const shiftTypesData = await shiftTypesRes.json();

      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      // Handle paginated response - employees come as { data: [...], page, limit, total }
      const employeesList = employeesData?.data || (Array.isArray(employeesData) ? employeesData : []);
      setEmployees(employeesList);
      setShiftTypes(Array.isArray(shiftTypesData) ? shiftTypesData : []);
    } catch (error: any) {
      console.error('Fetch data error:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    if (!formData.shiftId) {
      toast.error('Please select a shift type');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Start date and end date are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const payload = {
        employeeId: formData.employeeId,
        shiftId: formData.shiftId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      const response = await fetch('http://localhost:3000/time-management/shifts/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to assign shift');
      }

      toast.success('Shift assigned successfully!');
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to assign shift');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedAssignment) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/shifts/${selectedAssignment._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      toast.success(`Status updated to ${newStatus}`);
      setStatusDialogOpen(false);
      setSelectedAssignment(null);
      fetchData();
    } catch (error: any) {
      console.error('Update status error:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/shifts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete shift assignment');
      }

      toast.success('Shift assignment deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete assignment');
    }
  };

  const resetForm = () => {
    setFormData({ employeeId: '', shiftId: '', startDate: '', endDate: '', status: 'PENDING' });
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    const statusStyles: Record<string, { bg: string; color: string }> = {
      APPROVED: { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' },
      PENDING: { bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white' },
      CANCELLED: { bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white' },
      EXPIRED: { bg: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', color: 'white' },
    };
    const style = statusStyles[status] || statusStyles.PENDING;
    return (
      <Chip
        label={status}
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

  // Filter assignments based on role
  const filteredAssignments = isEmployee 
    ? assignments.filter(a => a.employeeId?._id === userId)
    : assignments;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Header - Purple/Pink Theme */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Shift Assignments
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEmployee ? 'View your assigned shifts' : 'Assign shifts to employees, departments, or positions'}
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
              Assign Shift
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
                  stroke: 'url(#gradientPurple)',
                },
              }}
            />
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAF5FF' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Assignee</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Shift Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                  {(canEdit || canDelete || canChangeStatus) && <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(canEdit || canDelete || canChangeStatus) ? 6 : 5} align="center" sx={{ py: 8 }}>
                      <Users size={48} color="#D8B4FE" style={{ marginBottom: 16 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748B', mb: 0.5 }}>
                        No shift assignments found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {canCreate ? 'Create one to get started.' : 'No shifts assigned to you.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow
                      key={assignment._id}
                      sx={{
                        '&:hover': {
                          bgcolor: '#FAF5FF',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell>
                        {assignment.employeeId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                background: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)',
                                borderRadius: 2,
                              }}
                            >
                              <User size={16} color="#9333EA" />
                            </Paper>
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>
                                {assignment.employeeId.firstName} {assignment.employeeId.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                {assignment.employeeId.employeeNumber}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {assignment.departmentId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                                borderRadius: 2,
                              }}
                            >
                              <Building2 size={16} color="#2563EB" />
                            </Paper>
                            <Typography sx={{ fontWeight: 600 }}>{assignment.departmentId.name}</Typography>
                          </Box>
                        )}
                        {assignment.positionId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
                                borderRadius: 2,
                              }}
                            >
                              <Briefcase size={16} color="#EA580C" />
                            </Paper>
                            <Typography sx={{ fontWeight: 600 }}>{assignment.positionId.title}</Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{assignment.shiftId?.name || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(assignment.startDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(assignment.endDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(assignment.status)}</TableCell>
                      {(canEdit || canDelete || canChangeStatus) && (
                        <TableCell align="right">
                          {canChangeStatus && (
                            <IconButton
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setStatusDialogOpen(true);
                              }}
                              sx={{
                                color: '#9333EA',
                                '&:hover': {
                                  bgcolor: '#E9D5FF',
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
                              onClick={() => handleDelete(assignment._id)}
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

      {/* Create Assignment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px -10px rgba(147, 51, 234, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          Assign Shift
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#9333EA' } }}>Employee</InputLabel>
                  <Select
                    value={formData.employeeId}
                    label="Employee"
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9333EA',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#9333EA' } }}>Shift Type</InputLabel>
                  <Select
                    value={formData.shiftId}
                    label="Shift Type"
                    onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9333EA',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {shiftTypes.map((shift) => (
                      <MenuItem key={shift._id} value={shift._id}>
                        {shift.name}
                      </MenuItem>
                    ))}
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
                        borderColor: '#9333EA',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#9333EA',
                    },
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#9333EA',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#9333EA',
                    },
                  }}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#9333EA' } }}>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9333EA',
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                </Select>
              </FormControl>
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
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
                px: 4,
                borderRadius: 2,
              }}
            >
              Assign Shift
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px -10px rgba(147, 51, 234, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            color: 'white',
            fontWeight: 700,
          }}
        >
          Update Status
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748B' }}>
            Change the status of this shift assignment
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Button
              onClick={() => handleStatusUpdate('APPROVED')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate('PENDING')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                },
              }}
            >
              Set Pending
            </Button>
            <Button
              onClick={() => handleStatusUpdate('CANCELLED')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate('EXPIRED')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
                },
              }}
            >
              Mark Expired
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            sx={{ color: '#64748B' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
