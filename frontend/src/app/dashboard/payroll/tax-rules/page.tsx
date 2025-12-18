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
  Percent as PercentIcon,
  Numbers as NumbersIcon,
  Label as LabelIcon
} from '@mui/icons-material';

type TaxRule = {
  _id: string;
  code?: string;
  name: string;
  bracketFrom?: number;
  bracketTo?: number;
  rate: number;
  description?: string;
  status: string;
  createdAt?: string;
};

export default function TaxRulesPage() {
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    bracketFrom: "0",
    bracketTo: "0",
    rate: "0",
    description: "",
  });

  async function loadRules() {
    try {
      setLoading(true);
      const res = await api.get<TaxRule[]>(`/payroll-configuration/tax-rules`);
      setRules(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tax rules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  function setField(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      bracketFrom: Number(form.bracketFrom),
      bracketTo: Number(form.bracketTo),
      rate: Number(form.rate),
      description: form.description.trim() || undefined,
    };

    if (!payload.code) return setError("Code is required.");
    if (!payload.name) return setError("Name is required.");
    if (!Number.isFinite(payload.bracketFrom)) return setError("Bracket From is not a valid number.");
    if (!Number.isFinite(payload.bracketTo)) return setError("Bracket To is not a valid number.");
    if (!Number.isFinite(payload.rate)) return setError("Rate is not a valid number.");
    if (payload.bracketFrom < 0) return setError("Bracket From must be ≥ 0.");
    if (payload.bracketTo < 0) return setError("Bracket To must be ≥ 0.");
    if (payload.rate < 0) return setError("Rate must be ≥ 0.");
    if (payload.bracketTo !== 0 && payload.bracketFrom >= payload.bracketTo) {
      return setError("Bracket From must be < Bracket To (unless Bracket To is 0).");
    }

    try {
      setSaving(true);
      await api.post(`/payroll-configuration/tax-rules`, payload);
      setForm({
        code: "",
        name: "",
        bracketFrom: "0",
        bracketTo: "0",
        rate: "0",
        description: "",
      });
      await loadRules();
    } catch (err: any) {
      console.error("AXIOS ERROR:", err?.response?.data || err);
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(" | ") : (msg || "Failed to save tax rule."));
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/tax-rules/${id}/${action}`, { approvedBy: 'system' });
      await loadRules();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} tax rule.`);
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
            Tax Rules
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Configure tax brackets and deduction rates for payroll processing.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadRules}
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
                <AddIcon color="primary" /> New Tax Rule
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Rule Code"
                  value={form.code}
                  onChange={(e) => setField('code', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. TAX-EG-01"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><NumbersIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Rule Name"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. Income Tax Tier 1"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LabelIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="From Amount"
                    type="number"
                    value={form.bracketFrom}
                    onChange={(e) => setField('bracketFrom', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                  <TextField
                    label="To Amount (0 = ∞)"
                    type="number"
                    value={form.bracketTo}
                    onChange={(e) => setField('bracketTo', e.target.value)}
                    required
                    fullWidth
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Box>
                <TextField
                  label="Tax Rate (%)"
                  type="number"
                  value={form.rate}
                  onChange={(e) => setField('rate', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><PercentIcon fontSize="small" /></InputAdornment>,
                    inputProps: { min: 0, step: 0.1 }
                  }}
                />
                <TextField
                  label="Description (Optional)"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Tax Rule'}
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
                  Existing Rules
                </Typography>
              </Box>
              {rules.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No tax rules found. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Bracket Range</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rules.map((rule) => (
                        <TableRow key={rule._id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {rule.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Chip label={rule.code} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {rule.bracketFrom?.toLocaleString()} — {rule.bracketTo === 0 ? 'No Limit' : rule.bracketTo?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${rule.rate}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.status}
                              size="small"
                              color={getStatusColor(rule.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(rule._id, 'approve')}
                                disabled={loading || rule.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(rule._id, 'reject')}
                                disabled={loading || rule.status === 'rejected'}
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

