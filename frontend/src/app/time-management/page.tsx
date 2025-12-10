'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Tabs as MuiTabs, Tab } from '@mui/material';
import { Clock, Users, Calendar, CalendarDays, Sparkles, LogIn, FileEdit } from 'lucide-react';
import { motion } from 'framer-motion';
import ShiftTypesTab from '@/components/time-management/ShiftTypesTab';
import ShiftAssignmentsTab from '@/components/time-management/ShiftAssignmentsTab';
import ScheduleRulesTab from '@/components/time-management/ScheduleRulesTab';
import HolidaysTab from '@/components/time-management/HolidaysTab';
import AttendanceTab from '@/components/time-management/AttendanceTab';
import CorrectionRequestsTab from '@/components/time-management/CorrectionRequestsTab';

export default function TimeManagementPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 50%, #ede7f6 100%)' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
          {/* Hero Header with Gradient */}
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 6,
              background: 'linear-gradient(135deg, #2563EB 0%, #5B21B6 50%, #7C3AED 100%)',
              p: 4,
              mb: 4,
              boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.4)',
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(60px)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -100,
                left: -100,
                width: 300,
                height: 300,
                bgcolor: 'rgba(124, 58, 237, 0.3)',
                borderRadius: '50%',
                filter: 'blur(60px)',
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                }}
              >
                <Clock size={32} color="white" />
              </Paper>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>
                    Time Management
                  </Typography>
                  <Sparkles size={24} color="#FCD34D" className="animate-pulse" />
                </Box>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 0.5 }}>
                  Orchestrate shifts, schedules, and team availability with precision
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Material-UI Tabs with Gradient */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              mb: 4,
            }}
          >
            <MuiTabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  py: 2.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                },
                '& .Mui-selected': {
                  color: 'white !important',
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={18} />
                    Shift Types
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={18} />
                    Assignments
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={18} />
                    Schedule Rules
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarDays size={18} />
                    Holidays
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LogIn size={18} />
                    Attendance
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)',
                  },
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileEdit size={18} />
                    Corrections
                  </Box>
                }
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
                    boxShadow: '0 4px 12px rgba(0, 137, 123, 0.4)',
                  },
                }}
              />
            </MuiTabs>
          </Paper>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 0 && <ShiftTypesTab />}
            {activeTab === 1 && <ShiftAssignmentsTab />}
            {activeTab === 2 && <ScheduleRulesTab />}
            {activeTab === 3 && <HolidaysTab />}
            {activeTab === 4 && <AttendanceTab />}
            {activeTab === 5 && <CorrectionRequestsTab />}
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
