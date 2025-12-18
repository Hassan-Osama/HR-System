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
  MenuItem,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Gavel as PolicyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

type PolicyType =
  | 'Deduction'
  | 'Allowance'
  | 'Benefit'
  | 'Misconduct'
  | 'Leave';

type Applicability =
  | 'All Employees'
  | 'Full Time Employees'
  | 'Part Time Employees'
  | 'Contractors';

type Policy = {
  _id: string;
  policyName: string;
  policyType: PolicyType;
  description: string;
  effectiveDate: string;
  applicability: Applicability;
  status: string;
  ruleDefinition: {
    percentage: number;
    fixedAmount: number;
    thresholdAmount: number;
  };
  createdAt?: string;
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    policyName: "",
    policyType: "Deduction" as PolicyType,
    description: "",
    effectiveDate: "",
    applicability: "All Employees" as Applicability,
    percentage: "",
    fixedAmount: "",
    thresholdAmount: "",
  });

  async function fetchPolicies() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Policy[]>('/payroll-configuration/policies');
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load policies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPolicies();
  }, []);

  function updateField(key: keyof typeof form, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const percentage = Number(form.percentage);
    const fixedAmount = Number(form.fixedAmount);
    const thresholdAmount = Number(form.thresholdAmount);

    if (!form.policyName || !form.description || !form.effectiveDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);
      await api.post('/payroll-configuration/policies', {
        policyName: form.policyName,
        policyType: form.policyType,
        description: form.description,
        effectiveDate: form.effectiveDate,
        applicability: form.applicability,
        ruleDefinition: {
          percentage: isNaN(percentage) ? 0 : percentage,
          fixedAmount: isNaN(fixedAmount) ? 0 : fixedAmount,
          thresholdAmount: isNaN(thresholdAmount) ? 0 : thresholdAmount,
        },
      });

      setForm({
        policyName: "",
        policyType: "Deduction",
        description: "",
        effectiveDate: "",
        applicability: "All Employees",
        percentage: "",
        fixedAmount: "",
        thresholdAmount: "",
      });

      await fetchPolicies();
    } catch (err) {
      console.error(err);
      setError('Failed to create policy.');
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      await api.patch(`/payroll-configuration/policies/${id}/${action}`, { approvedBy: 'system' });
      await fetchPolicies();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message;
      alert(`Backend Error: ${msg}`);
      setError(`Failed to ${action} policy: ${msg}`);
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
            Payroll Policies
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Define company rules for deductions, allowances, and benefits.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchPolicies}
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
        <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 400px' } }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon color="primary" /> New Policy
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Policy Name"
                  value={form.policyName}
                  onChange={(e) => updateField('policyName', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. Late Arrival Deduction"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PolicyIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />
                <TextField
                  select
                  label="Policy Type"
                  value={form.policyType}
                  onChange={(e) => updateField('policyType', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Deduction">Deduction</MenuItem>
                  <MenuItem value="Allowance">Allowance</MenuItem>
                  <MenuItem value="Benefit">Benefit</MenuItem>
                  <MenuItem value="Misconduct">Misconduct</MenuItem>
                  <MenuItem value="Leave">Leave</MenuItem>
                </TextField>
                <TextField
                  label="Effective Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.effectiveDate}
                  onChange={(e) => updateField('effectiveDate', e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  select
                  label="Applicability"
                  value={form.applicability}
                  onChange={(e) => updateField('applicability', e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="All Employees">All Employees</MenuItem>
                  <MenuItem value="Full Time Employees">Full Time Employees</MenuItem>
                  <MenuItem value="Part Time Employees">Part Time Employees</MenuItem>
                  <MenuItem value="Contractors">Contractors</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Percentage %"
                    type="number"
                    value={form.percentage}
                    onChange={(e) => updateField('percentage', e.target.value)}
                    fullWidth
                    size="small"
                    helperText="Optional"
                  />
                  <TextField
                    label="Fixed Amount"
                    type="number"
                    value={form.fixedAmount}
                    onChange={(e) => updateField('fixedAmount', e.target.value)}
                    fullWidth
                    size="small"
                    helperText="Optional"
                  />
                </Box>
                <TextField
                  label="Threshold / Limit"
                  type="number"
                  value={form.thresholdAmount}
                  onChange={(e) => updateField('thresholdAmount', e.target.value)}
                  fullWidth
                  size="small"
                  helperText="e.g. Max deduction amount or min days rule"
                />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><DescriptionIcon fontSize="small" sx={{ color: 'text.secondary', mt: 1 }} /></InputAdornment>,
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Create Policy'}
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
                  Existing Policies
                </Typography>
              </Box>
              {policies.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No policies configured. Add one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 800 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rules</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Audience</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {policies.map((p) => (
                        <TableRow key={p._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {p.policyName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {new Date(p.effectiveDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={p.policyType} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" display="block">
                              P: {p.ruleDefinition.percentage}% / F: {p.ruleDefinition.fixedAmount}
                            </Typography>
                            {p.ruleDefinition.thresholdAmount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Threshold: {p.ruleDefinition.thresholdAmount}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{p.applicability}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={p.status}
                              size="small"
                              color={getStatusColor(p.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleAction(p._id, 'approve')}
                                disabled={loading || p.status === 'approved'}
                                title="Approve"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAction(p._id, 'reject')}
                                disabled={loading || p.status === 'rejected'}
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
