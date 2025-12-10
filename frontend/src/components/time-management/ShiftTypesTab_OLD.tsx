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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShiftType {
  _id: string;
  name: string;
  active: boolean;
}

export default function ShiftTypesTab() {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShiftType, setEditingShiftType] = useState<ShiftType | null>(null);
  const [formData, setFormData] = useState({ name: '', active: true });
  const { toast } = useToast();

  useEffect(() => {
    fetchShiftTypes();
  }, []);

  const fetchShiftTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/shift-types', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShiftTypes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch shift types error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch shift types. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'Shift type name is required', variant: 'destructive' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const url = editingShiftType
        ? `http://localhost:3000/time-management/shift-types/${editingShiftType._id}`
        : 'http://localhost:3000/time-management/shift-types';
      
      const response = await fetch(url, {
        method: editingShiftType ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingShiftType ? 'update' : 'create'} shift type`);
      }

      toast({
        title: 'Success',
        description: `Shift type ${editingShiftType ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData({ name: '', active: true });
      setEditingShiftType(null);
      fetchShiftTypes();
    } catch (error: any) {
      console.error('Save shift type error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save shift type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (shiftType: ShiftType) => {
    setEditingShiftType(shiftType);
    setFormData({ name: shiftType.name, active: shiftType.active });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift type?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/shift-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(errorData.message || 'This shift type is in use and cannot be deleted');
        }
        throw new Error(errorData.message || 'Failed to delete shift type');
      }

      toast({ title: 'Success', description: 'Shift type deleted successfully' });
      fetchShiftTypes();
    } catch (error: any) {
      console.error('Delete shift type error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete shift type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shift Types
            </CardTitle>
            <CardDescription className="text-base">Manage different types of work shifts</CardDescription>
          </div>
          <Button 
            onClick={() => { setDialogOpen(true); setEditingShiftType(null); setFormData({ name: '', active: true }); }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shift Type
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading shift types...</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/80">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shiftTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No shift types found</p>
                    <p className="text-sm">Create one to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                shiftTypes.map((shiftType, index) => (
                  <TableRow key={shiftType._id} className="hover:bg-blue-50/50 transition-colors duration-200 animate-in fade-in-50" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold">{shiftType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={shiftType.active ? 'default' : 'secondary'}
                        className={shiftType.active ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}
                      >
                        {shiftType.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(shiftType)}
                        className="hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(shiftType._id)}
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
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {editingShiftType ? 'Edit' : 'Create'} Shift Type
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingShiftType ? 'Update' : 'Add a new'} shift type to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Shift Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Normal Day Shift (9-5)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                />
                <Label htmlFor="active" className="text-base font-medium cursor-pointer">Active Status</Label>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="hover:bg-gray-100">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                {editingShiftType ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
