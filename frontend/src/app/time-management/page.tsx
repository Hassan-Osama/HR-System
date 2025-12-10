'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs as MuiTabs, Tab, Tooltip, Badge } from '@mui/material';
import { Clock, Users, Calendar, CalendarDays, LogIn, FileEdit, Sparkles, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import ShiftTypesTab from '@/components/time-management/ShiftTypesTab';
import ShiftAssignmentsTab from '@/components/time-management/ShiftAssignmentsTab';
import ScheduleRulesTab from '@/components/time-management/ScheduleRulesTab';
import HolidaysTab from '@/components/time-management/HolidaysTab';
import AttendanceTab from '@/components/time-management/AttendanceTab';
import CorrectionRequestsTab from '@/components/time-management/CorrectionRequestsTab';
import OvertimeRulesTab from '@/components/time-management/OvertimeRulesTab';
import LatenessRulesTab from '@/components/time-management/LatenessRulesTab';
import ReportsTab from '@/components/time-management/ReportsTab';
import '@/styles/time-management.css';

const tabs = [
  { label: 'Shift Types', icon: Clock, color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
  { label: 'Assignments', icon: Users, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)' },
  { label: 'Schedule Rules', icon: Calendar, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' },
  { label: 'Holidays', icon: CalendarDays, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)' },
  { label: 'Attendance', icon: LogIn, color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
  { label: 'Corrections', icon: FileEdit, color: '#14B8A6', gradient: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' },
  { label: 'Overtime Rules', icon: TrendingUp, color: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' },
  { label: 'Lateness Rules', icon: AlertTriangle, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' },
  { label: 'Reports', icon: BarChart3, color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
];

export default function TimeManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag and initialize time on client-side only
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <ShiftTypesTab />;
      case 1: return <ShiftAssignmentsTab />;
      case 2: return <ScheduleRulesTab />;
      case 3: return <HolidaysTab />;
      case 4: return <AttendanceTab />;
      case 5: return <CorrectionRequestsTab />;
      case 6: return <OvertimeRulesTab />;
      case 7: return <LatenessRulesTab />;
      case 8: return <ReportsTab />;
      default: return <ShiftTypesTab />;
    }
  };

  const currentColor = tabs[activeTab]?.color || '#6366F1';
  const currentGradient = tabs[activeTab]?.gradient || tabs[0].gradient;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, pt: 3 }}>
        {/* Enhanced Header */}
        <Paper
          elevation={0}
          className="tm-fade-in-up"
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${currentColor}15 0%, ${currentColor}08 50%, transparent 100%)`,
            border: '1px solid',
            borderColor: `${currentColor}25`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: `radial-gradient(circle, ${currentColor}10 0%, transparent 70%)`,
              transform: 'translate(50%, -50%)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                className="tm-float"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: currentGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 24px ${currentColor}40`,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 4,
                    background: currentGradient,
                    opacity: 0.3,
                    filter: 'blur(8px)',
                    zIndex: -1,
                  },
                }}
              >
                <Clock size={28} color="white" />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', letterSpacing: '-0.02em' }}>
                    Time Management
                  </Typography>
                  <Sparkles size={18} color={currentColor} style={{ opacity: 0.7 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
                  Manage shifts, schedules, and attendance tracking
                </Typography>
              </Box>
            </Box>

            {/* Live Clock Display */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Time
                </Typography>
                <Typography
                  className="tm-time-display"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: '#1E293B',
                    lineHeight: 1,
                  }}
                >
                  {currentTime ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </Typography>
              </Box>
              <Box sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: `${currentColor}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Clock size={22} color={currentColor} />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Enhanced Tabs */}
        <Paper
          elevation={0}
          className="tm-scale-in"
          sx={{
            borderRadius: 3,
            bgcolor: 'white',
            mb: 3,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <MuiTabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                py: 2.5,
                px: 3,
                minHeight: 64,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                color: '#64748B',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: '3px solid transparent',
                '&:hover': {
                  color: '#1E293B',
                  bgcolor: '#F8FAFC',
                },
              },
              '& .Mui-selected': {
                color: `${currentColor} !important`,
                fontWeight: 600,
                bgcolor: `${currentColor}08 !important`,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: currentGradient,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 -2px 10px ${currentColor}50`,
              },
            }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === index;
              return (
                <Tab
                  key={tab.label}
                  label={
                    <Tooltip title={tab.label} placement="bottom" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            background: isActive ? tab.gradient : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive ? `0 4px 12px ${tab.color}40` : 'none',
                          }}
                        >
                          <Icon
                            size={18}
                            style={{
                              color: isActive ? 'white' : tab.color,
                              transition: 'color 0.3s ease',
                            }}
                          />
                        </Box>
                        <span>{tab.label}</span>
                      </Box>
                    </Tooltip>
                  }
                />
              );
            })}
          </MuiTabs>
        </Paper>

        {/* Tab Content with smooth transition */}
        <Box
          key={activeTab}
          className="tm-fade-in-up"
          sx={{
            '& > *': {
              animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        >
          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
}
