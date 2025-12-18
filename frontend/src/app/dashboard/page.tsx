'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Typography, Box, Grid, Card, CardContent, Avatar, Paper, List, ListItem, ListItemText, ListItemAvatar, Divider, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { People, Assignment, Assessment, PersonSearch, TrendingUp, Groups, Business, Work, Notifications, Schedule, Payments } from '@mui/icons-material';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '@/services/notificationsService';
import StatsOverview from '@/components/Dashboard/StatsOverview';
import ActivityChart from '@/components/Dashboard/ActivityChart';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [today, setToday] = useState('');

    useEffect(() => {
        setToday(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    // Role Definitions
    const role = user?.role;
    const isSystemAdmin = role === 'System Admin';
    const isHRManager = role === 'HR Manager';
    const isHRAdmin = role === 'HR Admin';
    const isHREmployee = role === 'HR Employee';
    const isDeptHead = role === 'Department Head' || role === 'department head';
    const isDeptEmployee = role === 'Department Employee';
    const isPayrollManager = role === 'Payroll Manager';
    const isPayrollSpecialist = role === 'Payroll Specialist';
    const isRecruiter = role === 'Recruiter';
    const isFinance = role === 'Finance Staff';
    const isLegal = role === 'Legal & Policy Admin';

    // Access Logic
    const canViewEmployees = isSystemAdmin || isHRManager || isHRAdmin || isHREmployee || isPayrollManager || isPayrollSpecialist || isRecruiter || isDeptHead;
    const canViewCandidates = isSystemAdmin || isHRManager || isHREmployee || isRecruiter;
    const canManageOrgStructure = isSystemAdmin || isHRManager || isHRAdmin;
    const canViewOrgHierarchy = true; // Everyone can view the hierarchy chart

    const cards = [
        {
            title: 'Employees',
            description: 'Manage employee profiles and information',
            icon: <People />,
            href: '/dashboard/employees',
            color: '#2563EB', // Blue
            visible: canViewEmployees,
        },
        {
            title: 'My Profile',
            description: 'View and update your profile information',
            icon: <Assignment />,
            href: '/dashboard/profile',
            color: '#10B981', // Emerald
            visible: true,
        },
        {
            title: 'My Team',
            description: 'View your direct reports and their status',
            icon: <Groups />,
            href: '/dashboard/my-team',
            color: '#7C4DFF', // Deep Purple
            visible: true,
        },
        {
            title: 'Organization Hierarchy',
            description: 'View organizational structure and departments',
            icon: <Assessment />,
            href: '/dashboard/organization/hierarchy',
            color: '#0EA5E9', // Sky
            visible: canViewOrgHierarchy,
        },
        {
            title: 'Change Requests',
            description: 'View and manage change requests',
            icon: <Assessment />,
            href: '/dashboard/change-requests',
            color: '#F59E0B', // Amber
            visible: true,
        },
        {
            title: 'Candidates',
            description: 'Manage recruitment candidates',
            icon: <PersonSearch />,
            href: '/dashboard/candidates',
            color: '#EC4899', // Pink
            visible: canViewCandidates,
        },
        {
            title: 'Performance',
            description: 'Manage appraisals, cycles, and templates',
            icon: <TrendingUp />,
            href: '/dashboard/performance',
            color: '#EF4444', // Red
            visible: true,
        },
        {
            title: 'Time Management',
            description: 'Manage shifts, schedules, and holidays',
            icon: <Schedule />,
            href: '/time-management',
            color: '#8B5CF6', // Violet
            visible: true,
        },
        {
            title: 'Payroll Configuration',
            description: 'Configure company payroll, tax rules, and benefits',
            icon: <Payments />,
            href: '/dashboard/payroll',
            color: '#14B8A6', // Teal
            visible: isSystemAdmin || isPayrollManager || isHRManager,
        },
    ];

    const visibleCards = cards.filter(card => card.visible);

    // Fetch recent notifications
    const { data: notificationsData } = useQuery({
        queryKey: ['recent-notifications'],
        queryFn: () => notificationsService.getNotifications(1, 5),
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box>
                {/* Hero Section */}
                <Box sx={{ mb: 4, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #2563EB 30%, #7C4DFF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Welcome back, {user?.fullName}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                            {user?.role} Dashboard
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 500 }}>
                        {today}
                    </Typography>
                </Box>

                {/* Stats Overview */}
                <StatsOverview />

                <Grid container spacing={4}>
                    {/* Left Column: Charts & Action Cards */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Box sx={{ mb: 4 }}>
                            <ActivityChart />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3}>
                            {visibleCards.map((card, index) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={card.title}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                    >
                                        <Card
                                            component={Link}
                                            href={card.href}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                textDecoration: 'none',
                                                position: 'relative',
                                                overflow: 'visible',
                                                borderRadius: 4,
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.1)',
                                                    '& .icon-avatar': {
                                                        transform: 'scale(1.1)',
                                                        bgcolor: card.color,
                                                        color: '#fff',
                                                    }
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, justifyContent: 'space-between' }}>
                                                    <Avatar
                                                        className="icon-avatar"
                                                        sx={{
                                                            bgcolor: alpha(card.color, 0.1),
                                                            color: card.color,
                                                            width: 56,
                                                            height: 56,
                                                            transition: 'all 0.3s ease',
                                                            borderRadius: 3,
                                                        }}
                                                    >
                                                        {card.icon}
                                                    </Avatar>
                                                </Box>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                                    {card.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    {card.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}

                            {/* Organization Management Section */}
                            {canManageOrgStructure && (
                                <>
                                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                            Organization Management
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            component={Link}
                                            href="/dashboard/organization/departments"
                                            sx={{ height: '100%', textDecoration: 'none', borderRadius: 4 }}
                                        >
                                            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha('#64748B', 0.1), color: '#64748B', borderRadius: 3 }}>
                                                    <Business />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        Departments
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Manage organization departments
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            component={Link}
                                            href="/dashboard/organization/positions"
                                            sx={{ height: '100%', textDecoration: 'none', borderRadius: 4 }}
                                        >
                                            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha('#64748B', 0.1), color: '#64748B', borderRadius: 3 }}>
                                                    <Work />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        Positions
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Manage positions and roles
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>

                    {/* Right Column: Recent Activity */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', height: '100%', maxHeight: 800, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha('#2563EB', 0.05) }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Notifications color="primary" /> Recent Activity
                                </Typography>
                            </Box>
                            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                                {notificationsData?.data?.length === 0 ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography color="text.secondary">No recent activity</Typography>
                                    </Box>
                                ) : (
                                    notificationsData?.data?.map((notification: any, index: number) => (
                                        <motion.div
                                            key={notification._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                        >
                                            <ListItem alignItems="flex-start" sx={{ px: 3, py: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: notification.isRead ? 'action.selected' : 'primary.light', width: 32, height: 32 }}>
                                                        <Notifications sx={{ fontSize: 16 }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>
                                                            {notification.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                {notification.message}
                                                            </Typography>
                                                            <Typography component="span" variant="caption" color="text.disabled">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            {index < (notificationsData?.data?.length || 0) - 1 && <Divider variant="inset" component="li" />}
                                        </motion.div>
                                    ))
                                )}
                            </List>
                            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                <Link href="/dashboard/notifications" style={{ textDecoration: 'none', color: '#2563EB', fontWeight: 500, fontSize: '0.875rem' }}>
                                    View All Notifications
                                </Link>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
}
