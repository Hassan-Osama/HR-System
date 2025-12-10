'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
} from '@mui/material';
import { Plus, CheckCircle, XCircle, Clock, Eye, FileEdit, Send } from 'lucide-react';
import { toast } from 'sonner';

interface RequestedPunch {
  type: 'IN' | 'OUT';
  time: string;
}

interface CorrectionRequest {
  _id: string;
  employeeId: { _id: string; firstName: string; lastName: string; fullName: string; employeeNumber: string };
  date: string;
  requestedPunches: RequestedPunch[];
  reason: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: { firstName: string; lastName: string; fullName: string };
  reviewComment?: string;
  reviewedAt?: string;
  createdAt: string;
}

export default function CorrectionRequestsTab() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [myRequests, setMyRequests] = useState<CorrectionRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  const [newRequest, setNewRequest] = useState({
    date: '',
    requestedPunches: [{ type: 'IN' as 'IN' | 'OUT', time: '' }],
    reason: '',
  });

  const [reviewForm, setReviewForm] = useState({
    action: 'APPROVE' as 'APPROVE' | 'REJECT',
    comment: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.userId) setUserId(user.userId);
        if (user.role) setUserRole(user.role);
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }
    fetchData();
  }, []);

  // Role-based permissions
  const isAdmin = ['System Admin', 'HR Admin'].includes(userRole);
  const isHRManager = ['HR Manager'].includes(userRole);
  const isManager = ['Department Head', 'Line Manager'].includes(userRole);
  const isEmployee = !isAdmin && !isHRManager && !isManager;
  
  // Who can do what
  const canReview = isAdmin || isHRManager || isManager;
  const canViewAllRequests = isAdmin || isHRManager;
  const canViewPendingTab = canReview;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [myRes, pendingRes, allRes] = await Promise.all([
        fetch('http://localhost:3000/time-management/corrections/my-requests', { headers }),
        fetch('http://localhost:3000/time-management/corrections/pending', { headers }).catch(() => null),
        fetch('http://localhost:3000/time-management/corrections', { headers }).catch(() => null),
      ]);

      if (myRes.ok) {
        const data = await myRes.json();
        setMyRequests(Array.isArray(data) ? data : []);
      }

      if (pendingRes?.ok) {
        const data = await pendingRes.json();
        setPendingRequests(Array.isArray(data) ? data : []);
      }

      if (allRes?.ok) {
        const data = await allRes.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.date || !newRequest.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const validPunches = newRequest.requestedPunches.filter(p => p.time);
    if (validPunches.length === 0) {
      toast.error('Please add at least one punch with time');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/time-management/corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: userId,
          date: newRequest.date,
          requestedPunches: validPunches,
          reason: newRequest.reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create request');
      }

      toast.success('Correction request submitted successfully!');
      setCreateDialogOpen(false);
      setNewRequest({ date: '', requestedPunches: [{ type: 'IN', time: '' }], reason: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create request');
    }
  };

  const handleReview = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/time-management/corrections/${selectedRequest._id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: reviewForm.action,
          reviewedBy: userId,
          comment: reviewForm.comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to review request');
      }

      toast.success(`Request ${reviewForm.action.toLowerCase()}d successfully!`);
      setReviewDialogOpen(false);
      setReviewForm({ action: 'APPROVE', comment: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to review request');
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { bgcolor: string; color: string; icon: React.ReactNode }> = {
      SUBMITTED: { bgcolor: '#e3f2fd', color: '#1565c0', icon: <Clock size={14} /> },
      IN_REVIEW: { bgcolor: '#fff3e0', color: '#e65100', icon: <Clock size={14} /> },
      APPROVED: { bgcolor: '#e8f5e9', color: '#2e7d32', icon: <CheckCircle size={14} /> },
      REJECTED: { bgcolor: '#ffebee', color: '#c62828', icon: <XCircle size={14} /> },
    };

    const config = statusConfig[status] || statusConfig.SUBMITTED;

    return (
      <Chip
        size="small"
        icon={config.icon as any}
        label={status}
        sx={{ bgcolor: config.bgcolor, color: config.color }}
      />
    );
  };

  const renderRequestsTable = (data: CorrectionRequest[], showActions: boolean = false) => (
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            {canReview && <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>}
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Requested Punches</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canReview ? 7 : 6} align="center" sx={{ py: 4, color: '#666' }}>
                No correction requests found
              </TableCell>
            </TableRow>
          ) : (
            data.map((request) => (
              <TableRow key={request._id} hover>
                {canReview && (
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {request.employeeId?.fullName || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {request.employeeId?.employeeNumber}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>{formatDate(request.date)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {request.requestedPunches.map((punch, idx) => (
                      <Chip
                        key={idx}
                        size="small"
                        label={`${punch.type} ${formatTime(punch.time)}`}
                        sx={{
                          bgcolor: punch.type === 'IN' ? '#e8f5e9' : '#ffebee',
                          color: punch.type === 'IN' ? '#2e7d32' : '#c62828',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {request.reason}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(request.status)}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {formatDate(request.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedRequest(request);
                      setDetailDialogOpen(true);
                    }}
                    sx={{ color: '#9c27b0' }}
                  >
                    <Eye size={18} />
                  </IconButton>
                  {showActions && request.status === 'SUBMITTED' && canReview && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedRequest(request);
                        setReviewDialogOpen(true);
                      }}
                      sx={{ color: '#4caf50' }}
                    >
                      <CheckCircle size={18} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress sx={{ color: '#9c27b0' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
          <FileEdit style={{ marginRight: 8, verticalAlign: 'middle', color: '#9c27b0' }} />
          Correction Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #7b1fa2 0%, #c2185b 100%)' },
          }}
        >
          New Request
        </Button>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: '#9c27b0' },
            '& .MuiTabs-indicator': { bgcolor: '#9c27b0' },
          }}
        >
          <Tab label={`My Requests (${myRequests.length})`} />
          {canViewPendingTab && <Tab label={`Pending Approval (${pendingRequests.length})`} />}
          {canViewAllRequests && <Tab label={`All Requests (${requests.length})`} />}
        </Tabs>

        <Box sx={{ p: 0 }}>
          {tabValue === 0 && renderRequestsTable(myRequests, false)}
          {tabValue === 1 && canViewPendingTab && renderRequestsTable(pendingRequests, true)}
          {tabValue === 2 && canViewAllRequests && renderRequestsTable(requests, true)}
        </Box>
      </Paper>

      {/* Create Request Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#9c27b0', color: 'white' }}>
          <Send style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Submit Correction Request
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={newRequest.date}
            onChange={(e) => setNewRequest({ ...newRequest, date: e.target.value })}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Requested Punches:</Typography>
          {newRequest.requestedPunches.map((punch, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={punch.type}
                  label="Type"
                  onChange={(e) => {
                    const newPunches = [...newRequest.requestedPunches];
                    newPunches[idx].type = e.target.value as 'IN' | 'OUT';
                    setNewRequest({ ...newRequest, requestedPunches: newPunches });
                  }}
                >
                  <MenuItem value="IN">IN</MenuItem>
                  <MenuItem value="OUT">OUT</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="datetime-local"
                size="small"
                label="Time"
                value={punch.time}
                onChange={(e) => {
                  const newPunches = [...newRequest.requestedPunches];
                  newPunches[idx].time = e.target.value;
                  setNewRequest({ ...newRequest, requestedPunches: newPunches });
                }}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              {newRequest.requestedPunches.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => {
                    const newPunches = newRequest.requestedPunches.filter((_, i) => i !== idx);
                    setNewRequest({ ...newRequest, requestedPunches: newPunches });
                  }}
                  sx={{ color: '#d32f2f' }}
                >
                  ×
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            size="small"
            onClick={() => setNewRequest({
              ...newRequest,
              requestedPunches: [...newRequest.requestedPunches, { type: 'OUT', time: '' }]
            })}
            sx={{ mb: 2, color: '#9c27b0' }}
          >
            + Add Punch
          </Button>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Correction"
            value={newRequest.reason}
            onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
            placeholder="Explain why you need this correction..."
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateRequest}
            disabled={!newRequest.date || !newRequest.reason}
            sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)' }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#9c27b0', color: 'white' }}>
          Request Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Employee</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedRequest.employeeId?.fullName}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">{formatDate(selectedRequest.date)}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Requested Punches:</Typography>
              <Box sx={{ mb: 2 }}>
                {selectedRequest.requestedPunches.map((punch, idx) => (
                  <Chip
                    key={idx}
                    size="small"
                    label={`${punch.type} at ${formatTime(punch.time)}`}
                    sx={{
                      mr: 1,
                      mb: 1,
                      bgcolor: punch.type === 'IN' ? '#e8f5e9' : '#ffebee',
                      color: punch.type === 'IN' ? '#2e7d32' : '#c62828',
                    }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reason:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{selectedRequest.reason}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status:</Typography>
                {getStatusChip(selectedRequest.status)}
              </Box>

              {selectedRequest.reviewedBy && (
                <Alert severity={selectedRequest.status === 'APPROVED' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Reviewed by:</strong> {selectedRequest.reviewedBy.fullName}
                  </Typography>
                  {selectedRequest.reviewComment && (
                    <Typography variant="body2">
                      <strong>Comment:</strong> {selectedRequest.reviewComment}
                    </Typography>
                  )}
                  {selectedRequest.reviewedAt && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {formatDate(selectedRequest.reviewedAt)}
                    </Typography>
                  )}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
          <CheckCircle style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Review Request
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Employee:</strong> {selectedRequest.employeeId?.fullName}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(selectedRequest.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Reason:</strong> {selectedRequest.reason}
                </Typography>
              </Alert>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Decision</InputLabel>
                <Select
                  value={reviewForm.action}
                  label="Decision"
                  onChange={(e) => setReviewForm({ ...reviewForm, action: e.target.value as 'APPROVE' | 'REJECT' })}
                >
                  <MenuItem value="APPROVE">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle size={18} color="#4caf50" />
                      Approve
                    </Box>
                  </MenuItem>
                  <MenuItem value="REJECT">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <XCircle size={18} color="#f44336" />
                      Reject
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comment (optional)"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Add a comment for the employee..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleReview}
            sx={{
              bgcolor: reviewForm.action === 'APPROVE' ? '#4caf50' : '#f44336',
              '&:hover': { bgcolor: reviewForm.action === 'APPROVE' ? '#388e3c' : '#d32f2f' },
            }}
          >
            {reviewForm.action === 'APPROVE' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
