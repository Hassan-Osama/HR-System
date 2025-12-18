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
  Label as LabelIcon
} from '@mui/icons-material';

type PayType = {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function PayTypesPage() {
  const [payTypes, setPayTypes] = useState<PayType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "",
    amount: "",
  });

  async function loadPayTypes() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<PayType[]>("/payroll-configuration/pay-types");
      setPayTypes(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pay types.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayTypes();
  }, []);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = Number(form.amount);

    if (!form.type.trim()) {
      setError("Type is required.");
      return;
    }
    if (Number.isNaN(amount) || amount < 0) {
      setError("Amount must be a positive number.");
    }

    try {
      setSaving(true);
      await api.post("/payroll-configuration/pay-types", {
        type: form.type,
        amount,
      });

      setForm({ type: "", amount: "" });
      await loadPayTypes();
    } catch (err) {
      console.error(err);
      setError("Failed to create pay type (type must be unique).");
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/pay-types/${id}/${action}`, { approvedBy: 'system' });
      await loadPayTypes();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} pay type.`);
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
            Pay Types
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Define recurring pay components (e.g., Basic Salary, Housing Allowance).
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadPayTypes}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Create Form */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon color="primary" /> New Pay Type
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Pay Type Name"
                  value={form.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. OVERTIME_HOURLY"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LabelIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Default Amount"
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Pay Type'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* List Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Existing Pay Types
                </Typography>
              </Box>
              {payTypes.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No pay types configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Type Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payTypes.map((pt) => (
                        <TableRow key={pt._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {pt.type}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {pt.amount?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={pt.status}
                              size="small"
                              color={getStatusColor(pt.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(pt._id, 'approve')}
                                disabled={loading || pt.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(pt._id, 'reject')}
                                disabled={loading || pt.status === 'rejected'}
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
        </Grid>
      </Grid>
    </Box>
  );
}
