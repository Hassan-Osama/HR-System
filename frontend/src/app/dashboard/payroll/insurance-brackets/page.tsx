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
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  Security as SecurityIcon,
  Percent as PercentIcon
} from '@mui/icons-material';

type InsuranceBracket = {
  _id: string;
  name: string;
  minSalary: number;
  maxSalary: number;
  employeeRate: number;
  employerRate: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function InsuranceBracketsPage() {
  const [brackets, setBrackets] = useState<InsuranceBracket[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    minSalary: "",
    maxSalary: "",
    employeeRate: "",
    employerRate: "",
  });

  async function loadBrackets() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<InsuranceBracket[]>("/payroll-configuration/insurance-brackets");
      setBrackets(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load insurance brackets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrackets();
  }, []);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const minSalary = Number(form.minSalary);
    const maxSalary = Number(form.maxSalary);
    const employeeRate = Number(form.employeeRate);
    const employerRate = Number(form.employerRate);

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (Number.isNaN(minSalary) || Number.isNaN(maxSalary)) {
      setError("Min and Max salary must be valid numbers.");
      return;
    }
    if (minSalary > maxSalary) {
      setError("Min salary cannot be greater than Max salary.");
      return;
    }
    if (
      Number.isNaN(employeeRate) ||
      Number.isNaN(employerRate) ||
      employeeRate < 0 ||
      employerRate < 0 ||
      employeeRate > 100 ||
      employerRate > 100
    ) {
      setError("Rates must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/payroll-configuration/insurance-brackets", {
        name: form.name,
        minSalary,
        maxSalary,
        employeeRate,
        employerRate,
      });

      setForm({
        name: "",
        minSalary: "",
        maxSalary: "",
        employeeRate: "",
        employerRate: "",
      });

      await loadBrackets();
    } catch (err) {
      console.error(err);
      setError("Failed to create insurance bracket (name must be unique).");
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/insurance-brackets/${id}/${action}`, { approvedBy: 'system' });
      await loadBrackets();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} bracket.`);
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
            Insurance Rules
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Configure social insurance contributions and salary brackets.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadBrackets}
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
                <AddIcon color="primary" /> New Bracket
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Bracket Name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. Standard Bracket"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SecurityIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Min Salary"
                    type="number"
                    value={form.minSalary}
                    onChange={(e) => updateField('minSalary', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Max Salary"
                    type="number"
                    value={form.maxSalary}
                    onChange={(e) => updateField('maxSalary', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Employee %"
                    type="number"
                    value={form.employeeRate}
                    onChange={(e) => updateField('employeeRate', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end"><PercentIcon fontSize="small" /></InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Employer %"
                    type="number"
                    value={form.employerRate}
                    onChange={(e) => updateField('employerRate', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end"><PercentIcon fontSize="small" /></InputAdornment>,
                    }}
                  />
                </Box>

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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Bracket'}
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
                  Existing Insurance Brackets
                </Typography>
              </Box>
              {brackets.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No insurance brackets configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Salary Range</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Emp. Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Comp. Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {brackets.map((b) => (
                        <TableRow key={b._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {b.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {b.minSalary.toLocaleString()} - {b.maxSalary.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{b.employeeRate}%</TableCell>
                          <TableCell>{b.employerRate}%</TableCell>
                          <TableCell>
                            <Chip
                              label={b.status}
                              size="small"
                              color={getStatusColor(b.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(b._id, 'approve')}
                                disabled={loading || b.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(b._id, 'reject')}
                                disabled={loading || b.status === 'rejected'}
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
