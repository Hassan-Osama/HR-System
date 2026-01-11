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
  IconButton
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Refresh as RefreshIcon,
  DateRange as DateIcon,
  Business as BusinessIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

export default function RunPayrollPage() {
  const { user } = useAuth();
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    payrollPeriod: new Date().toISOString().split('T')[0],
    entity: 'My Company'
  });

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payroll-execution/runs');
      setRuns(response.data);
    } catch (error) {
      console.error('Error fetching payroll runs:', error);
      setError("Failed to load payroll runs.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Fallback to user.userId if employeeId is not available
    const currentUser = user as any;
    const specialistId = currentUser?.employeeId || currentUser?.userId;

    if (!specialistId) {
      setError("Could not identify the current user. Please re-login.");
      return;
    }

    try {
      setCreating(true);
      await api.post('/payroll-execution/runs', {
        ...formData,
        employees: 0,
        exceptions: 0,
        totalnetpay: 0,
        payrollSpecialistId: specialistId
      });

      setSuccess("Payroll run created successfully.");
      fetchRuns();
    } catch (error: any) {
      console.error('Error creating payroll run:', error);
      const msg = error?.response?.data?.message || "Failed to create payroll run.";
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleGeneratePayslips = async (runId: string) => {
    try {
      setGenerating(runId);
      setError(null);
      setSuccess(null);

      await api.post(`/payroll-execution/runs/${runId}/generate-payslips`);

      setSuccess("Payslips generated successfully for the run.");
      fetchRuns();
    } catch (error) {
      console.error('Error generating payslips:', error);
      setError("Failed to generate payslips.");
    } finally {
      setGenerating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'locked': return 'success';
      case 'approved': return 'info';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Run Payroll
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            Initiate payroll cycles and generate payslips for employees.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchRuns}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Create Form */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 350px' } }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RunIcon color="primary" /> New Payroll Run
              </Typography>
              <Box component="form" onSubmit={handleCreateRun} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Payroll Period End Date"
                  type="date"
                  value={formData.payrollPeriod}
                  onChange={(e) => setFormData({ ...formData, payrollPeriod: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><DateIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  }}
                />

                <TextField
                  label="Entity / Company Name"
                  value={formData.entity}
                  onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BusinessIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
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
                  {creating ? <CircularProgress size={24} color="inherit" /> : 'Create Draft Run'}
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
                  Payroll Runs History
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : runs.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No payroll runs found. Create one to get started.
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Run ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {runs.map((run) => (
                        <TableRow key={run._id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {run.runId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(run.payrollPeriod).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={run.status}
                              size="small"
                              color={getStatusColor(run.status) as any}
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={run.paymentStatus}
                              size="small"
                              variant="outlined"
                              color={run.paymentStatus === 'paid' ? 'success' : 'default'}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {run.status === 'draft' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleGeneratePayslips(run._id)}
                                disabled={generating === run._id}
                              >
                                {generating === run._id ? <CircularProgress size={20} color="inherit" /> : 'Generate Payslips'}
                              </Button>
                            )}
                            {run.status !== 'draft' && (
                              <IconButton size="small" title="View Details">
                                <ViewIcon />
                              </IconButton>
                            )}
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
