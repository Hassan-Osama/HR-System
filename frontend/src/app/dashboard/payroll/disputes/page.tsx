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
  ReportProblem as ReportProblemIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material';

export default function DisputesPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    payslipId: ''
  });

  useEffect(() => {
    const currentUser = user as any;
    if (currentUser?.employeeId) {
      fetchDisputes();
      fetchPayslips();
    } else if (user && !currentUser.employeeId) {
      setLoading(false);
    }
  }, [user]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = user as any;
      const response = await api.get(`/payroll-tracking/disputes?employeeId=${currentUser.employeeId}`);
      setDisputes(response.data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      setError("Failed to load disputes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayslips = async () => {
    try {
      const currentUser = user as any;
      const response = await api.get(`/payroll-tracking/payslips/employee/${currentUser.employeeId}`);
      setPayslips(response.data);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.payslipId) {
      setError("Please select a payslip.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
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
      await api.post('/payroll-tracking/disputes', {
        ...formData,
        employeeId: employeeId
      });

      setFormData({ description: '', payslipId: '' });
      fetchDisputes();
    } catch (error: any) {
      console.error('Error creating dispute:', error);
      const msg = error?.response?.data?.message || "Failed to submit dispute.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'success';
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
            My Disputes
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Raise and track disputes regarding your salary.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchDisputes}
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
                <AddIcon color="primary" /> New Dispute
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  label="Select Payslip"
                  value={formData.payslipId}
                  onChange={(e) => setFormData({ ...formData, payslipId: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><ReceiptIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                >
                  <MenuItem value=""><em>Select a payslip...</em></MenuItem>
                  {payslips.map((payslip) => (
                    <MenuItem key={payslip._id} value={payslip._id}>
                      Run: {payslip.payrollRunId} - Net: {payslip.netPay}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  placeholder="Describe the issue with your payslip..."
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}><ReportProblemIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Submit Dispute'}
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
                  Dispute History
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : disputes.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No disputes found.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Payslip</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {dispute.disputeId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {dispute.payslipId?.payrollRunId || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {dispute.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={dispute.status}
                              size="small"
                              color={getStatusColor(dispute.status) as any}
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
