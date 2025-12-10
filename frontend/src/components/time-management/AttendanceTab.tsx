'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import { Clock, LogIn, LogOut, Calendar, Timer, AlertTriangle, Edit, Eye, Users, UserCheck, UserX, Coffee, History } from 'lucide-react';
import { toast } from 'sonner';

interface Punch {
  type: 'IN' | 'OUT';
  time: string;
  location?: string;
}

interface TodayAttendanceStatus {
  employee: Employee;
  status: 'checked-in' | 'checked-out' | 'not-arrived' | 'on-break';
  checkInTime?: string;
  checkOutTime?: string;
  lastPunchTime?: string;
  totalMinutes: number;
}

interface AttendanceRecord {
  _id: string;
  employeeId: { _id: string; firstName: string; lastName: string; fullName: string; employeeNumber: string };
  date: string;
  punches: Punch[];
  totalWorkMinutes: number;
  hasMissedPunch: boolean;
  finalisedForPayroll: boolean;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  employeeNumber: string;
}

export default function AttendanceTab() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [todayAllRecords, setTodayAllRecords] = useState<AttendanceRecord[]>([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [punchPolicy, setPunchPolicy] = useState<string>('MULTIPLE');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'checked-in' | 'checked-out' | 'not-arrived'>('all');
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Today, 1 = History

  const [correctionForm, setCorrectionForm] = useState({
    punches: [{ type: 'IN', time: '' }],
    reason: '',
  });

  // Role-based permissions
  const isAdmin = ['System Admin', 'HR Admin'].includes(userRole);
  const isHRManager = ['HR Manager'].includes(userRole);
  const isManager = ['Department Head', 'Line Manager'].includes(userRole);
  const isEmployee = !isAdmin && !isHRManager && !isManager;
  
  // Who can do what
  const canViewAllRecords = isAdmin || isHRManager;
  const canViewTeamRecords = isManager;
  const canCorrectAttendance = isAdmin || isHRManager || isManager;
  const canChangePunchPolicy = isAdmin;

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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [recordsRes, todayRes, policyRes, employeesRes] = await Promise.all([
        fetch('http://localhost:3000/time-management/attendance', { headers }),
        fetch('http://localhost:3000/time-management/attendance/my-today', { headers }),
        fetch('http://localhost:3000/time-management/settings/punch-policy', { headers }),
        fetch('http://localhost:3000/api/employee-profile', { headers }),
      ]);

      if (recordsRes.ok) {
        const data = await recordsRes.json();
        const allRecords = Array.isArray(data) ? data : [];
        setRecords(allRecords);
        
        // Filter today's records for schedule view
        // Use the same formatting as displayDate to ensure consistency
        const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        const todaysRecords = allRecords.filter((r: AttendanceRecord) => {
          if (!r.date) return false;
          const recordFormatted = new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          return recordFormatted === todayFormatted;
        });
        
        setTodayAllRecords(todaysRecords);
      }

      if (todayRes.ok) {
        const data = await todayRes.json();
        setTodayRecord(data);
      }

      if (policyRes.ok) {
        const data = await policyRes.json();
        setPunchPolicy(data.value || 'MULTIPLE');
      }

      if (employeesRes.ok) {
        const data = await employeesRes.json();
        const employeesList = data?.data || (Array.isArray(data) ? data : []);
        setEmployees(employeesList);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !userId) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/attendance/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clock in');
      }

      const data = await response.json();
      toast.success(data.message || 'Clocked in successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !userId) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/attendance/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clock out');
      }

      const data = await response.json();
      toast.success(data.message || 'Clocked out successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to clock out');
    }
  };

  const handleCorrection = async () => {
    if (!selectedRecord) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/time-management/attendance/${selectedRecord._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          punches: correctionForm.punches.filter(p => p.time),
          reason: correctionForm.reason,
          correctedBy: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to correct attendance');
      }

      toast.success('Attendance corrected successfully!');
      setCorrectionDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to correct attendance');
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatWorkTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLastPunchType = (): 'IN' | 'OUT' | null => {
    if (!todayRecord || todayRecord.punches.length === 0) return null;
    return todayRecord.punches[todayRecord.punches.length - 1].type;
  };

  // Get today's attendance status from today's records directly
  const getTodayAttendanceSchedule = (): TodayAttendanceStatus[] => {
    // Build schedule from today's attendance records
    return todayAllRecords.map(record => {
      const employee: Employee = record.employeeId || {
        _id: 'unknown',
        firstName: 'Unknown',
        lastName: 'Employee',
        fullName: 'Unknown Employee',
        employeeNumber: 'N/A'
      };
      
      if (!record.punches || record.punches.length === 0) {
        return {
          employee,
          status: 'not-arrived' as const,
          totalMinutes: 0,
        };
      }

      const lastPunch = record.punches[record.punches.length - 1];
      const firstPunch = record.punches[0];
      const lastOutPunch = [...record.punches].reverse().find(p => p.type === 'OUT');

      let status: 'checked-in' | 'checked-out' | 'not-arrived' | 'on-break';
      if (lastPunch.type === 'IN') {
        status = 'checked-in';
      } else if (lastPunch.type === 'OUT') {
        status = 'checked-out';
      } else {
        status = 'not-arrived';
      }

      return {
        employee,
        status,
        checkInTime: firstPunch?.time,
        checkOutTime: lastOutPunch?.time,
        lastPunchTime: lastPunch?.time,
        totalMinutes: record.totalWorkMinutes,
      };
    });
  };

  const todaySchedule = getTodayAttendanceSchedule();
  
  // Count statistics
  const checkedInCount = todaySchedule.filter(s => s.status === 'checked-in').length;
  const checkedOutCount = todaySchedule.filter(s => s.status === 'checked-out').length;
  const notArrivedCount = todaySchedule.filter(s => s.status === 'not-arrived').length;

  // Filter schedule based on selected filter
  const filteredSchedule = scheduleFilter === 'all' 
    ? todaySchedule 
    : todaySchedule.filter(s => s.status === scheduleFilter);

  // Filter records based on role
  const filteredRecords = isEmployee 
    ? records.filter(r => r.employeeId?._id === userId)
    : records;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress sx={{ color: '#9c27b0' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Tab Navigation */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            bgcolor: '#f5f5f5',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 56,
            },
            '& .Mui-selected': {
              color: '#9c27b0 !important',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#9c27b0',
              height: 3,
            },
          }}
        >
          <Tab 
            icon={<Clock size={18} />} 
            iconPosition="start" 
            label="Today" 
          />
          <Tab 
            icon={<History size={18} />} 
            iconPosition="start" 
            label="History" 
          />
        </Tabs>
      </Paper>

      {/* TODAY TAB */}
      {activeTab === 0 && (
        <>
          {/* Today's Status Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  <Clock style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Today's Attendance
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                
                {todayRecord && todayRecord.punches.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Punches today: {todayRecord.punches.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      First In: {formatTime(todayRecord.punches[0].time)}
                    </Typography>
                    {todayRecord.punches.length > 1 && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Last: {todayRecord.punches[todayRecord.punches.length - 1].type} at {formatTime(todayRecord.punches[todayRecord.punches.length - 1].time)}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                      Total Work Time: {formatWorkTime(todayRecord.totalWorkMinutes)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                    No punches recorded yet today
                  </Typography>
                )}
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LogIn />}
                  onClick={handleClockIn}
                  disabled={getLastPunchType() === 'IN'}
                  sx={{
                    bgcolor: 'white',
                    color: '#9c27b0',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    '&:disabled': { bgcolor: 'rgba(255,255,255,0.5)', color: 'rgba(0,0,0,0.3)' },
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Clock In
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LogOut />}
                  onClick={handleClockOut}
                  disabled={!todayRecord || todayRecord.punches.length === 0 || getLastPunchType() === 'OUT'}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    '&:disabled': { bgcolor: 'transparent', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.3)' },
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Clock Out
                </Button>
              </Grid>
            </Grid>

            {punchPolicy === 'FIRST_LAST' && (
              <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
                Punch Policy: FIRST_LAST - Only the first clock-in and last clock-out of the day count.
              </Alert>
            )}
          </Paper>

          {/* Today's Attendance Schedule - Only for managers and above */}
          {(canViewAllRecords || canViewTeamRecords) && (
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #e0e0e0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  <Users style={{ marginRight: 8, verticalAlign: 'middle', color: '#9c27b0' }} />
                  Who's Working Today
                </Typography>
                
                {/* Statistics Cards */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<UserCheck size={16} />}
                    label={`Working: ${checkedInCount}`}
                    onClick={() => setScheduleFilter(scheduleFilter === 'checked-in' ? 'all' : 'checked-in')}
                    sx={{ 
                      bgcolor: scheduleFilter === 'checked-in' ? '#4caf50' : '#e8f5e9', 
                      color: scheduleFilter === 'checked-in' ? 'white' : '#2e7d32',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: scheduleFilter === 'checked-in' ? '#388e3c' : '#c8e6c9' }
                    }}
                  />
                  <Chip
                    icon={<LogOut size={16} />}
                    label={`Left: ${checkedOutCount}`}
                    onClick={() => setScheduleFilter(scheduleFilter === 'checked-out' ? 'all' : 'checked-out')}
                    sx={{ 
                      bgcolor: scheduleFilter === 'checked-out' ? '#2196f3' : '#e3f2fd', 
                      color: scheduleFilter === 'checked-out' ? 'white' : '#1565c0',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: scheduleFilter === 'checked-out' ? '#1976d2' : '#bbdefb' }
                    }}
                  />
                </Box>
              </Box>

              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Work Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSchedule.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#666' }}>
                          No attendance records for today yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSchedule.map((item) => (
                        <TableRow 
                          key={item.employee._id} 
                          hover
                          sx={{
                            bgcolor: item.status === 'checked-in' ? 'rgba(76, 175, 80, 0.05)' : 
                                     item.status === 'checked-out' ? 'rgba(33, 150, 243, 0.05)' :
                                     'rgba(255, 152, 0, 0.05)'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: item.status === 'checked-in' ? '#4caf50' : 
                                           item.status === 'checked-out' ? '#2196f3' : '#ff9800',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                {item.employee.firstName?.charAt(0)}{item.employee.lastName?.charAt(0)}
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {item.employee.fullName || `${item.employee.firstName} ${item.employee.lastName}`}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {item.employee.employeeNumber}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={
                                item.status === 'checked-in' ? <UserCheck size={14} /> :
                                item.status === 'checked-out' ? <LogOut size={14} /> :
                                <UserX size={14} />
                              }
                              label={
                                item.status === 'checked-in' ? 'Working' :
                                item.status === 'checked-out' ? 'Left' :
                                'Not Arrived'
                              }
                              sx={{
                                bgcolor: item.status === 'checked-in' ? '#e8f5e9' : 
                                         item.status === 'checked-out' ? '#e3f2fd' : '#fff3e0',
                                color: item.status === 'checked-in' ? '#2e7d32' : 
                                       item.status === 'checked-out' ? '#1565c0' : '#e65100',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {item.checkInTime ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LogIn size={14} color="#4caf50" />
                                <Typography variant="body2">{formatTime(item.checkInTime)}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">--:--</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.checkOutTime ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LogOut size={14} color="#2196f3" />
                                <Typography variant="body2">{formatTime(item.checkOutTime)}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">--:--</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.totalMinutes > 0 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Timer size={14} color="#9c27b0" />
                                <Typography variant="body2">{formatWorkTime(item.totalMinutes)}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">0h 0m</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* HISTORY TAB */}
      {activeTab === 1 && (
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              <Calendar style={{ marginRight: 8, verticalAlign: 'middle', color: '#9c27b0' }} />
              Attendance History
            </Typography>
          </Box>

          <TableContainer>
            <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                {!isEmployee && <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Punches</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Work Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isEmployee ? 5 : 6} align="center" sx={{ py: 4, color: '#666' }}>
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record._id} hover>
                    {!isEmployee && (
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.employeeId?.fullName || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {record.employeeId?.employeeNumber}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {record.punches.map((punch, idx) => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer size={16} color="#9c27b0" />
                        {formatWorkTime(record.totalWorkMinutes)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {record.hasMissedPunch ? (
                        <Chip
                          size="small"
                          icon={<AlertTriangle size={14} />}
                          label="Missed Punch"
                          sx={{ bgcolor: '#fff3e0', color: '#e65100' }}
                        />
                      ) : record.finalisedForPayroll ? (
                        <Chip size="small" label="Complete" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                      ) : (
                        <Chip size="small" label="Pending" sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedRecord(record);
                          setDetailDialogOpen(true);
                        }}
                        sx={{ color: '#9c27b0' }}
                      >
                        <Eye size={18} />
                      </IconButton>
                      {canCorrectAttendance && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedRecord(record);
                            setCorrectionForm({
                              punches: record.punches.map(p => ({ type: p.type, time: new Date(p.time).toISOString().slice(0, 16) })),
                              reason: '',
                            });
                            setCorrectionDialogOpen(true);
                          }}
                          sx={{ color: '#f57c00' }}
                        >
                          <Edit size={18} />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#9c27b0', color: 'white' }}>
          Attendance Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRecord && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedRecord.employeeId?.fullName} - {formatDate(selectedRecord.date)}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Punches:</Typography>
              {selectedRecord.punches.map((punch, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Chip
                    size="small"
                    label={punch.type}
                    sx={{
                      bgcolor: punch.type === 'IN' ? '#e8f5e9' : '#ffebee',
                      color: punch.type === 'IN' ? '#2e7d32' : '#c62828',
                      width: 60,
                    }}
                  />
                  <Typography>{new Date(punch.time).toLocaleString()}</Typography>
                  {punch.location && <Typography variant="caption" color="text.secondary">({punch.location})</Typography>}
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Total Work Time</Typography>
                  <Typography variant="h6">{formatWorkTime(selectedRecord.totalWorkMinutes)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  {selectedRecord.hasMissedPunch ? (
                    <Chip size="small" icon={<AlertTriangle size={14} />} label="Missed Punch" sx={{ bgcolor: '#fff3e0', color: '#e65100' }} />
                  ) : selectedRecord.finalisedForPayroll ? (
                    <Chip size="small" label="Complete" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                  ) : (
                    <Chip size="small" label="Pending" sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }} />
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Correction Dialog */}
      <Dialog open={correctionDialogOpen} onClose={() => setCorrectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f57c00', color: 'white' }}>
          <Edit style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Correct Attendance
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRecord && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedRecord.employeeId?.fullName} - {formatDate(selectedRecord.date)}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Punches:</Typography>
              {correctionForm.punches.map((punch, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={punch.type}
                      label="Type"
                      onChange={(e) => {
                        const newPunches = [...correctionForm.punches];
                        newPunches[idx].type = e.target.value as 'IN' | 'OUT';
                        setCorrectionForm({ ...correctionForm, punches: newPunches });
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
                      const newPunches = [...correctionForm.punches];
                      newPunches[idx].time = e.target.value;
                      setCorrectionForm({ ...correctionForm, punches: newPunches });
                    }}
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newPunches = correctionForm.punches.filter((_, i) => i !== idx);
                      setCorrectionForm({ ...correctionForm, punches: newPunches });
                    }}
                    sx={{ color: '#d32f2f' }}
                  >
                    ×
                  </IconButton>
                </Box>
              ))}

              <Button
                size="small"
                onClick={() => setCorrectionForm({
                  ...correctionForm,
                  punches: [...correctionForm.punches, { type: 'OUT', time: '' }]
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
                value={correctionForm.reason}
                onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                required
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCorrectionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCorrection}
            disabled={!correctionForm.reason || correctionForm.punches.filter(p => p.time).length === 0}
            sx={{ bgcolor: '#f57c00', '&:hover': { bgcolor: '#ef6c00' } }}
          >
            Save Correction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
