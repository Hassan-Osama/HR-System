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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Chip,
    Alert,
    InputAdornment,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Badge as PositionIcon,
    AttachMoney as AmountIcon,
} from '@mui/icons-material';

interface SigningBonus {
    _id: string;
    positionName: string;
    amount: number;
    status: 'draft' | 'active' | 'archived';
}

export default function SigningBonusesPage() {
    const [bonuses, setBonuses] = useState<SigningBonus[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState({
        positionName: '',
        amount: '',
    });

    async function loadBonuses() {
        try {
            setLoading(true);
            const res = await api.get('/payroll-configuration/signing-bonuses');
            setBonuses(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load signing bonuses.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBonuses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/payroll-configuration/signing-bonuses', {
                ...form,
                amount: Number(form.amount),
            });
            setSuccess("Signing bonus created successfully!");
            setForm({ positionName: '', amount: '' });
            loadBonuses();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create signing bonus.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/payroll-configuration/signing-bonuses/${id}`);
            setSuccess("Bonus deleted.");
            loadBonuses();
        } catch (err) {
            setError("Failed to delete.");
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            await api.patch(`/payroll-configuration/signing-bonuses/${id}/${action}`);
            setSuccess(`Bonus ${action}d successfully!`);
            loadBonuses();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to ${action} bonus.`);
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'active': return <Chip label="Active" color="success" size="small" />;
            case 'draft': return <Chip label="Draft" color="warning" size="small" />;
            case 'archived': return <Chip label="Archived" color="error" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
                    Signing Bonuses
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage one-time signing bonuses based on position.
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                {/* Creation Form */}
                <Box sx={{ flex: 1 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Add New Bonus</Typography>
                            <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    label="Position Name"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={form.positionName}
                                    onChange={(e) => setForm({ ...form, positionName: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PositionIcon color="action" /></InputAdornment>,
                                    }}
                                />
                                <TextField
                                    label="Bonus Amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AmountIcon color="action" /></InputAdornment>,
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={<AddIcon />}
                                    sx={{ mt: 1, py: 1.5, borderRadius: 2, fontWeight: 600, bgcolor: '#14B8A6', '&:hover': { bgcolor: '#0D9488' } }}
                                >
                                    Create Bonus
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* List View */}
                <Box sx={{ flex: 2 }}>
                    <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && bonuses.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><CircularProgress size={30} /></TableCell></TableRow>
                                ) : bonuses.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>No signing bonuses found.</TableCell></TableRow>
                                ) : bonuses.map((bonus) => (
                                    <TableRow key={bonus._id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{bonus.positionName}</TableCell>
                                        <TableCell>${bonus.amount.toLocaleString()}</TableCell>
                                        <TableCell>{getStatusChip(bonus.status)}</TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                {bonus.status === 'draft' && (
                                                    <>
                                                        <Button size="small" variant="contained" color="success" onClick={() => handleAction(bonus._id, 'approve')} sx={{ minWidth: 40, p: 0.5 }}><ApproveIcon fontSize="small" /></Button>
                                                        <Button size="small" variant="outlined" color="error" onClick={() => handleAction(bonus._id, 'reject')} sx={{ minWidth: 40, p: 0.5 }}><RejectIcon fontSize="small" /></Button>
                                                    </>
                                                )}
                                                <IconButton size="small" color="error" onClick={() => handleDelete(bonus._id)}><DeleteIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
}
