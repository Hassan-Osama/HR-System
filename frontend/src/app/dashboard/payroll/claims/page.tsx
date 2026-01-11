'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  InputAdornment,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  RequestQuote as RequestQuoteIcon
} from '@mui/icons-material';

export default function ClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    claimType: 'Medical',
    amount: ''
  });

  useEffect(() => {
    // Use employeeId if available, otherwise fallback to userId
    const currentUser = user as any;
    const idToUse = currentUser?.employeeId || currentUser?.userId;
    if (idToUse) {
      fetchClaims(idToUse);
    } else if (user && !idToUse) {
      setLoading(false);
    }
  }, [user]);

  const fetchClaims = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/payroll-tracking/claims?employeeId=${id}`);
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setError("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = Number(formData.amount);
    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    // Fallback to user.userId if employeeId is not available
    const currentUser = user as any;
    const employeeId = currentUser?.employeeId || currentUser?.userId;

    if (!employeeId) {
      setError("Could not identify the current user. Please re-login.");
      return;
    }

    try {
      setSaving(true);
      await api.post('/payroll-tracking/claims', {
        ...formData,
        amount,
        employeeId: employeeId
      });

      setFormData({ description: '', claimType: 'Medical', amount: '' });
      // Refresh claims using the same ID
      fetchClaims(employeeId);
    } catch (error: any) {
      console.error('Error creating claim:', error);
      const msg = error?.response?.data?.message || "Failed to submit claim.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            My Claims
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Submit and track your reimbursement claims.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => fetchClaims((user as any)?.employeeId || (user as any)?.userId || '')}
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
                <AddIcon color="primary" /> New Claim
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  label="Claim Type"
                  value={formData.claimType}
                  onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><RequestQuoteIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                >
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Describe your claim..."
                />

                <TextField
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Submit Claim'}
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
                  Claim History
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : claims.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No claims found. Submit one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {claims.map((claim) => (
                        <TableRow key={claim._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {claim.claimId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {claim.claimType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {claim.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoneyIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight={600}>
                                {claim.amount?.toLocaleString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={claim.status}
                              size="small"
                              color={getStatusColor(claim.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
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
