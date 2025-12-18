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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  CardGiftcard as GiftIcon
} from '@mui/icons-material';

type Allowance = {
  _id: string;
  name: string;
  description: string;
  amount: number;
  taxable: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AllowancesPage() {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    taxable: "true",
  });

  async function fetchAllowances() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Allowance[]>("/payroll-configuration/allowances");
      setAllowances(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load allowances.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllowances();
  }, []);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = Number(form.amount);
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (Number.isNaN(amount) || amount < 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/payroll-configuration/allowances", {
        name: form.name,
        description: form.description,
        amount,
        taxable: form.taxable === "true",
      });

      setForm({
        name: "",
        description: "",
        amount: "",
        taxable: "true",
      });

      await fetchAllowances();
    } catch (err) {
      console.error(err);
      setError("Failed to create allowance.");
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      // Calling specific approve/reject endpoints: /allowances/:id/approve or /allowances/:id/reject
      await api.patch(`/payroll-configuration/allowances/${id}/${action}`, { approvedBy: 'system' });
      await fetchAllowances();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message;
      alert(`Backend Error: ${msg}`);
      setError(`Failed to ${action} allowance: ${msg}`);
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
            Allowances
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Manage recurring and one-time allowances for employees.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchAllowances}
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
                <AddIcon color="primary" /> New Allowance
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Allowance Name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. Housing Allowance"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><GiftIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => updateField('amount', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
                <TextField
                  select
                  label="Taxable?"
                  value={form.taxable}
                  onChange={(e) => updateField('taxable', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="true">Yes, Taxable</MenuItem>
                  <MenuItem value="false">No, Non-Taxable</MenuItem>
                </TextField>

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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Allowance'}
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
                  Existing Allowances
                </Typography>
              </Box>
              {allowances.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No allowances configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Taxable</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allowances.map((a) => (
                        <TableRow key={a._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {a.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {a.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {a.amount?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={a.taxable ? 'Yes' : 'No'}
                              size="small"
                              color={a.taxable ? 'warning' : 'default'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={a.status}
                              size="small"
                              color={getStatusColor(a.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(a._id, 'approve')}
                                disabled={loading || a.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(a._id, 'reject')}
                                disabled={loading || a.status === 'rejected'}
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
