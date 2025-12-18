'use client';

import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Settings,
    Gavel,
    AttachMoney,
    Category,
    CardGiftcard,
    Policy,
    HealthAndSafety,
    Money
} from '@mui/icons-material';
import Link from 'next/link';

export default function PayrollConfigurationPage() {
    const configModules = [
        {
            title: 'Company Settings',
            description: 'Configure global payroll settings',
            icon: <Settings />,
            href: '/dashboard/payroll/company-settings',
            color: '#64748B', // Slate
        },
        {
            title: 'Tax Rules',
            description: 'Manage tax regulations and deductions',
            icon: <Gavel />,
            href: '/dashboard/payroll/tax-rules',
            color: '#EF4444', // Red
        },
        {
            title: 'Pay Grades',
            description: 'Define salary structures and grades',
            icon: <AttachMoney />,
            href: '/dashboard/payroll/pay-grades',
            color: '#10B981', // Emerald
        },
        {
            title: 'Pay Types',
            description: 'Manage earnings and deduction types',
            icon: <Category />,
            href: '/dashboard/payroll/pay-types',
            color: '#F59E0B', // Amber
        },
        {
            title: 'Benefits',
            description: 'Configure employee benefits packages',
            icon: <CardGiftcard />,
            href: '/dashboard/payroll/benefits',
            color: '#EC4899', // Pink
        },
        {
            title: 'Policies',
            description: 'Set up payroll processing policies',
            icon: <Policy />,
            href: '/dashboard/payroll/policies',
            color: '#8B5CF6', // Violet
        },
        {
            title: 'Insurance Brackets',
            description: 'Manage insurance contribution tables',
            icon: <HealthAndSafety />,
            href: '/dashboard/payroll/insurance-brackets',
            color: '#0EA5E9', // Sky
        },
        {
            title: 'Allowances',
            description: 'Define recurring and one-time allowances',
            icon: <Money />,
            href: '/dashboard/payroll/allowances',
            color: '#2563EB', // Blue
        },
        {
            title: 'Signing Bonuses',
            description: 'Manage one-time signing bonuses for new hires',
            icon: <CardGiftcard />,
            href: '/dashboard/payroll/signing-bonuses',
            color: '#14B8A6', // Teal
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    Payroll Configuration
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage all aspects of your payroll system from one central location.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {configModules.map((module) => (
                    <Box key={module.title} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' } }}>
                        <Card
                            component={Link}
                            href={module.href}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                textDecoration: 'none',
                                position: 'relative',
                                borderRadius: 4,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(module.color, 0.1),
                                            color: module.color,
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {module.icon}
                                    </Avatar>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                                    {module.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {module.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
