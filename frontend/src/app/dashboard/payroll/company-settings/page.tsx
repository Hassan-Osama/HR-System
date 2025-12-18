'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

type SettingsObject = {
  [key: string]: any;
};

type PendingItem = {
  _id: string;
  configType: string;
  name?: string;
  policyName?: string;
  code?: string;
  description?: string;
  createdAt?: string;
  [key: string]: any;
};

const READONLY_KEYS = ["_id", "__v", "createdAt", "updatedAt"];

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<SettingsObject | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Approvals State
  const [pendingApprovals, setPendingApprovals] = useState<PendingItem[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/payroll-configuration/company-settings`);

      // Sometimes API returns an object, sometimes [object]
      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!data) {
        setSettings({});
        setForm({});
        return;
      }

      setSettings(data);

      const editable: Record<string, string> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (!READONLY_KEYS.includes(key)) {
          editable[key] =
            value === null || value === undefined ? "" : String(value);
        }
      });
      setForm(editable);
    } catch (err) {
      console.error(err);
      setError("Failed to load company settings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingApprovals() {
    try {
      setLoadingApprovals(true);
      const res = await api.get(`/payroll-configuration/pending-approvals`);

      // Flatten the response object { payTypes: [], payGrades: [], ... }
      const flattened: PendingItem[] = [];
      Object.entries(res.data).forEach(([key, items]: [string, any]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            flattened.push({ ...item, configType: item.configType || key });
          });
        }
      });

      setPendingApprovals(flattened);
    } catch (err) {
      console.error(err);
      // We don't want to block the whole page if approvals fail
    } finally {
      setLoadingApprovals(false);
    }
  }

  useEffect(() => {
    loadSettings();
    loadPendingApprovals();
  }, []);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function castValue(value: string): any {
    if (value === "") return "";
    // number?
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
    // boolean?
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setSaving(true);

      const patchBody: Record<string, any> = {};
      Object.entries(form).forEach(([key, value]) => {
        patchBody[key] = castValue(value);
      });

      await api.patch(`/payroll-configuration/company-settings`, patchBody);

      setMessage("Settings saved successfully.");
      await loadSettings();
    } catch (err) {
      console.error(err);
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  const handleAction = async (item: PendingItem, action: 'approve' | 'reject') => {
    try {
      setLoadingApprovals(true);
      // Construct endpoint: e.g. /payroll-configuration/pay-types/ID/approve
      const endpoint = `/payroll-configuration/${item.configType}/${item._id}/${action}`;
      await api.patch(endpoint, { approvedBy: 'Admin' });
      await loadPendingApprovals();
      setMessage(`Successfully ${action}d ${item.configType.replace('-', ' ')} item.`);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message;
      alert(`Backend Error: ${msg}`);
      setError(`Failed to ${action} item: ${msg}`);
    } finally {
      setLoadingApprovals(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <BusinessIcon fontSize="large" color="primary" /> Company Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
          Configure global payroll settings and manage pending approvals.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMessage(null)}>{message}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Settings Card */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Global Configuration</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(form).map(([key, value]) => (
                    <TextField
                      key={key}
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} // CamelCase to Title Case
                      value={value}
                      onChange={(e) => updateField(key, e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SettingsIcon fontSize="small" color="action" /></InputAdornment>,
                      }}
                    />
                  ))}
                  {Object.keys(form).length === 0 && !loading && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No configurable settings found.
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 1 }} />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={saving}
                  startIcon={<SaveIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#2563EB',
                    '&:hover': { bgcolor: '#1D4ED8' }
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Approvals Card */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Pending Approvals</Typography>
              <IconButton onClick={loadPendingApprovals} disabled={loadingApprovals}>
                <RefreshIcon />
              </IconButton>
            </Box>

            {loadingApprovals && pendingApprovals.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : pendingApprovals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                All clear! No configurations are pending approval.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Item Name/Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApprovals.map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell>
                          <Chip
                            label={item.configType.replace('-', ' ')}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.name || item.policyName || item.code || 'Unnamed Item'}
                          </Typography>
                          {item.description && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleAction(item, 'approve')}
                              sx={{ minWidth: 40, p: 0.5 }}
                              title="Approve"
                            >
                              <ApproveIcon fontSize="small" />
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleAction(item, 'reject')}
                              sx={{ minWidth: 40, p: 0.5 }}
                              title="Reject"
                            >
                              <RejectIcon fontSize="small" />
                            </Button>
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
  );
}
