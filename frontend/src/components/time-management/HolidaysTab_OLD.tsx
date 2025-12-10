'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  _id: string;
  type: 'NATIONAL' | 'ORGANIZATIONAL' | 'WEEKLY';
  startDate: string;
  endDate?: string;
  name: string;
  active: boolean;
}

export default function HolidaysTab() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  type HolidayType = 'NATIONAL' | 'ORGANIZATIONAL' | 'WEEKLY';
  const [formData, setFormData] = useState<{
    type: HolidayType;
    startDate: string;
    endDate: string;
    name: string;
    active: boolean;
  }>({
    type: 'NATIONAL',
    startDate: '',
    endDate: '',
    name: '',
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/holidays', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHolidays(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch holidays error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch holidays. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'Holiday name is required', variant: 'destructive' });
      return;
    }
    if (!formData.startDate) {
      toast({ title: 'Validation Error', description: 'Start date is required', variant: 'destructive' });
      return;
    }
    if (formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({ title: 'Validation Error', description: 'End date must be after start date', variant: 'destructive' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const url = editingHoliday
        ? `http://localhost:3000/time-management/holidays/${editingHoliday._id}`
        : 'http://localhost:3000/time-management/holidays';
      
      const payload = {
        ...formData,
        endDate: formData.endDate || undefined,
      };

      const response = await fetch(url, {
        method: editingHoliday ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingHoliday ? 'update' : 'create'} holiday`);
      }

      toast({
        title: 'Success',
        description: `Holiday ${editingHoliday ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData({ type: 'NATIONAL', startDate: '', endDate: '', name: '', active: true });
      setEditingHoliday(null);
      fetchHolidays();
    } catch (error: any) {
      console.error('Save holiday error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save holiday. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      type: holiday.type,
      startDate: holiday.startDate.split('T')[0],
      endDate: holiday.endDate ? holiday.endDate.split('T')[0] : '',
      name: holiday.name,
      active: holiday.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/holidays/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete holiday');
      }

      toast({ title: 'Success', description: 'Holiday deleted successfully' });
      fetchHolidays();
    } catch (error: any) {
      console.error('Delete holiday error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete holiday. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { variant: any; className: string }> = {
      NATIONAL: { 
        variant: 'default', 
        className: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0' 
      },
      ORGANIZATIONAL: { 
        variant: 'secondary', 
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0' 
      },
      WEEKLY: { 
        variant: 'outline', 
        className: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0' 
      },
    };
    const config = typeConfig[type] || typeConfig.NATIONAL;
    return <Badge variant={config.variant} className={config.className}>{type}</Badge>;
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Holidays
            </CardTitle>
            <CardDescription className="text-base">Manage national, organizational, and weekly holidays</CardDescription>
          </div>
          <Button 
            onClick={() => { setDialogOpen(true); setEditingHoliday(null); setFormData({ type: 'NATIONAL', startDate: '', endDate: '', name: '', active: true }); }}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading holidays...</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/80">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">End Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No holidays found</p>
                    <p className="text-sm">Create one to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                holidays.map((holiday, index) => (
                  <TableRow key={holiday._id} className="hover:bg-orange-50/50 transition-colors duration-200 animate-in fade-in-50" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                          <CalendarDays className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold">{holiday.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(holiday.type)}</TableCell>
                    <TableCell>{new Date(holiday.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {holiday.endDate ? new Date(holiday.endDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={holiday.active ? 'default' : 'secondary'}
                        className={holiday.active ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0' : ''}
                      >
                        {holiday.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(holiday)}
                        className="hover:bg-orange-100 hover:text-orange-600 transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(holiday._id)}
                        className="hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingHoliday ? 'Edit' : 'Create'} Holiday</DialogTitle>
            <DialogDescription>
              {editingHoliday ? 'Update' : 'Add a new'} holiday to the calendar
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Holiday Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Christmas Day"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: HolidayType) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NATIONAL">National</SelectItem>
                      <SelectItem value="ORGANIZATIONAL">Organizational</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for single-day holiday</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingHoliday ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
