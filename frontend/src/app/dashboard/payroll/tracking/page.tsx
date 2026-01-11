'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    ReceiptLong as ReceiptIcon,
    Description as DescriptionIcon,
    HealthAndSafety as HealthIcon,
    Gavel as GavelIcon,
    RequestQuote as RequestQuoteIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

// Components
import MyPayslipsPage from '../my-payslips/page';
import DocumentList from '@/components/payroll/DocumentList';
import DisputesManager from '@/components/payroll/DisputesManager';
import ClaimsManager from '@/components/payroll/ClaimsManager';
import PayrollAdminView from '@/components/payroll/PayrollAdminView';

export default function PayrollTrackingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const theme = useTheme();
    const [activeView, setActiveView] = useState<'menu' | 'payslips' | 'tax' | 'insurance' | 'claims' | 'disputes' | 'admin'>('menu');

    const isAdmin = user?.role === 'Payroll Specialist' || user?.role === 'Finance Staff' || user?.role === 'Payroll Manager';

    const menuItems = [
        {
            id: 'payslips',
            title: 'My Payslips',
            description: 'View and download your monthly payslips.',
            icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
            color: '#10B981', // Emerald
            bgcolor: alpha('#10B981', 0.1)
        },
        {
            id: 'tax',
            title: 'Tax Documents',
            description: 'W-2s, Tax Summaries & Adjustments.',
            icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
            color: '#3B82F6', // Blue
            bgcolor: alpha('#3B82F6', 0.1)
        },
        {
            id: 'insurance',
            title: 'Insurance',
            description: 'Health, Life & Benefit Certificates.',
            icon: <HealthIcon sx={{ fontSize: 40 }} />,
            color: '#06B6D4', // Cyan
            bgcolor: alpha('#06B6D4', 0.1)
        },
        {
            id: 'claims',
            title: 'My Claims',
            description: 'Submit and track reimbursement claims.',
            icon: <RequestQuoteIcon sx={{ fontSize: 40 }} />,
            color: '#8B5CF6', // Purple
            bgcolor: alpha('#8B5CF6', 0.1)
        },
        {
            id: 'disputes',
            title: 'Disputes',
            description: 'Raise issues & track resolution status.',
            icon: <GavelIcon sx={{ fontSize: 40 }} />,
            color: '#F43F5E', // Rose
            bgcolor: alpha('#F43F5E', 0.1)
        }
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'payslips':
                return (
                    <Box sx={{ mt: 2 }}>
                        <MyPayslipsPage className="shadow-sm border-0" />
                    </Box>
                );
            case 'tax':
                return (
                    <Card sx={{ borderRadius: 4, mt: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#F8FAFC' }}>
                                <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                    <DescriptionIcon color="primary" /> Tax Assessment & Documents
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Official government tax documents and year-end summaries.
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <DocumentList type="Tax Form" title="" />
                            </Box>
                        </CardContent>
                    </Card>
                );
            case 'insurance':
                return (
                    <Card sx={{ borderRadius: 4, mt: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#F8FAFC' }}>
                                <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                    <HealthIcon color="info" /> Insurance & Benefits
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active insurance policies and coverage certificates.
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <DocumentList type="Insurance Certificate" title="" />
                            </Box>
                        </CardContent>
                    </Card>
                );
            case 'claims':
                return <ClaimsManager />;
            case 'disputes':
                return (
                    <Card sx={{ borderRadius: 4, mt: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#F8FAFC' }}>
                                <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                    <GavelIcon color="error" /> Dispute Resolution Center
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track and manage payroll-related inquiries or disputes.
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <DisputesManager />
                            </Box>
                        </CardContent>
                    </Card>
                );
            case 'admin':
                return <PayrollAdminView />;
            default: return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F1F5F9', p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ maxWidth: '1280px', mx: 'auto', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => activeView === 'menu' ? router.back() : setActiveView('menu')}
                        sx={{ mb: 1, color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                    >
                        {activeView === 'menu' ? 'Back to Dashboard' : 'Back to Menu'}
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                        {activeView === 'menu' ? 'Payroll Tracking Center' : ''}
                    </Typography>
                </Box>
                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<AdminIcon />}
                        onClick={() => setActiveView('admin')}
                        sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, textTransform: 'none', borderRadius: 2 }}
                    >
                        Admin Console
                    </Button>
                )}
            </Box>

            <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
                {activeView === 'menu' ? (
                    <Grid container spacing={3}>
                        {menuItems.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                                    }}
                                    onClick={() => setActiveView(item.id as any)}
                                >
                                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 3,
                                                    bgcolor: item.bgcolor,
                                                    color: item.color,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    mb: 2
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: item.color, fontWeight: 600, fontSize: '0.875rem' }}>
                                            Access Module <ArrowForwardIcon sx={{ ml: 1, fontSize: 16 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    renderContent()
                )}
            </Box>
        </Box>
    );
}
