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
  Description as DescriptionIcon,
  CardGiftcard as GiftIcon
} from '@mui/icons-material';

type Benefit = {
  _id: string;
  name: string;
  amount: number;
  terms?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    terms: "",
  });

  async function loadBenefits() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Benefit[]>("/payroll-configuration/benefits");
      setBenefits(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load benefits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBenefits();
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
      setError("Amount must be a number ≥ 0.");
      return;
    }

    try {
      setCreating(true);
      await api.post("/payroll-configuration/benefits", {
        name: form.name,
        amount,
        terms: form.terms || undefined,
      });

      setForm({ name: "", amount: "", terms: "" });
      await loadBenefits();
    } catch (err) {
      console.error(err);
      setError("Failed to create benefit (name must be unique).");
    } finally {
      setCreating(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/benefits/${id}/${action}`, { approvedBy: 'system' });
      await loadBenefits();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} benefit.`);
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
            Benefits
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Configure termination gratuity and other employee benefits.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadBenefits}
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
                <AddIcon color="primary" /> New Benefit
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Benefit Name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. End of Service Gratuity"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><GiftIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Amount / Calculation Basis"
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
                  label="Terms & Conditions (Optional)"
                  value={form.terms}
                  onChange={(e) => updateField('terms', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  placeholder="e.g. Payable after 5 years of continuous service"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><DescriptionIcon fontSize="small" sx={{ color: 'text.secondary', mt: 1 }} /></InputAdornment>,
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={creating}
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
                  {creating ? <CircularProgress size={24} color="inherit" /> : 'Create Benefit'}
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
                  Existing Benefits
                </Typography>
              </Box>
              {benefits.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No benefits configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Benefit Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Terms</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {benefits.map((benefit) => (
                        <TableRow key={benefit._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {benefit.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {benefit.amount?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Typography variant="body2" noWrap title={benefit.terms}>
                              {benefit.terms || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={benefit.status}
                              size="small"
                              color={getStatusColor(benefit.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(benefit._id, 'approve')}
                                disabled={loading || benefit.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(benefit._id, 'reject')}
                                disabled={loading || benefit.status === 'rejected'}
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
