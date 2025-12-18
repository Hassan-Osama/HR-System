'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  Grade as GradeIcon
} from '@mui/icons-material';

type PayGrade = {
  _id: string;
  grade: string;
  baseSalary: number;
  grossSalary: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function PayGradesPage() {
  const [grades, setGrades] = useState<PayGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    grade: "",
    baseSalary: "",
    grossSalary: "",
  });

  async function loadGrades() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<PayGrade[]>("/payroll-configuration/pay-grades");
      setGrades(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pay grades.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGrades();
  }, []);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const baseSalary = Number(form.baseSalary);
    const grossSalary = Number(form.grossSalary);

    if (!form.grade.trim()) {
      setError("Grade is required.");
      return;
    }
    if (Number.isNaN(baseSalary) || baseSalary < 0) {
      setError("Base salary must be a valid positive number.");
      return;
    }
    if (Number.isNaN(grossSalary) || grossSalary < 0) {
      setError("Gross salary must be a valid positive number.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/payroll-configuration/pay-grades", {
        grade: form.grade,
        baseSalary,
        grossSalary,
      });

      setForm({ grade: "", baseSalary: "", grossSalary: "" });
      await loadGrades();
    } catch (err) {
      console.error(err);
      setError("Failed to create pay grade (grade must be unique).");
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/pay-grades/${id}/${action}`, { approvedBy: 'system' });
      await loadGrades();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} pay grade.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'draft': return 'default';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Pay Grades
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Define salary structures and grades (e.g., Junior, Senior, Manager).
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadGrades}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Create Form */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 350px' } }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon color="primary" /> New Pay Grade
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Grade Name"
                  value={form.grade}
                  onChange={(e) => updateField('grade', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. Senior Developer"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><GradeIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Base Salary"
                  type="number"
                  value={form.baseSalary}
                  onChange={(e) => updateField('baseSalary', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
                <TextField
                  label="Gross Salary"
                  type="number"
                  value={form.grossSalary}
                  onChange={(e) => updateField('grossSalary', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#2563EB',
                    '&:hover': { bgcolor: '#1D4ED8' }
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Grade'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* List Table */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Existing Grades
                </Typography>
              </Box>
              {grades.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No pay grades configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Base Salary</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Gross Salary</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {grade.grade}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {grade.baseSalary?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {grade.grossSalary?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={grade.status}
                              size="small"
                              color={getStatusColor(grade.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(grade._id, 'approve')}
                                disabled={loading || grade.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(grade._id, 'reject')}
                                disabled={loading || grade.status === 'rejected'}
                                title="Reject"
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
