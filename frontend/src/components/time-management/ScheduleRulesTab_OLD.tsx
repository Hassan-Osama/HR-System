'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleRule {
  _id: string;
  name: string;
  pattern: string;
  active: boolean;
}

export default function ScheduleRulesTab() {
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ScheduleRule | null>(null);
  const [formData, setFormData] = useState({ name: '', pattern: '', active: true });
  const { toast } = useToast();

  useEffect(() => {
    fetchScheduleRules();
  }, []);

  const fetchScheduleRules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/schedule-rules', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setScheduleRules(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch schedule rules error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch schedule rules. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'Rule name is required', variant: 'destructive' });
      return;
    }
    if (!formData.pattern.trim()) {
      toast({ title: 'Validation Error', description: 'Pattern description is required', variant: 'destructive' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const url = editingRule
        ? `http://localhost:3000/time-management/schedule-rules/${editingRule._id}`
        : 'http://localhost:3000/time-management/schedule-rules';
      
      const response = await fetch(url, {
        method: editingRule ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingRule ? 'update' : 'create'} schedule rule`);
      }

      toast({
        title: 'Success',
        description: `Schedule rule ${editingRule ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData({ name: '', pattern: '', active: true });
      setEditingRule(null);
      fetchScheduleRules();
    } catch (error: any) {
      console.error('Save schedule rule error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save schedule rule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (rule: ScheduleRule) => {
    setEditingRule(rule);
    setFormData({ name: rule.name, pattern: rule.pattern, active: rule.active });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule rule?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/schedule-rules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(errorData.message || 'This schedule rule is in use and cannot be deleted');
        }
        throw new Error(errorData.message || 'Failed to delete schedule rule');
      }

      toast({ title: 'Success', description: 'Schedule rule deleted successfully' });
      fetchScheduleRules();
    } catch (error: any) {
      console.error('Delete schedule rule error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete schedule rule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Schedule Rules
            </CardTitle>
            <CardDescription className="text-base">Define custom scheduling patterns for flexible work arrangements</CardDescription>
          </div>
          <Button 
            onClick={() => { setDialogOpen(true); setEditingRule(null); setFormData({ name: '', pattern: '', active: true }); }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading schedule rules...</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/80">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Pattern</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No schedule rules found</p>
                    <p className="text-sm">Create one to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                scheduleRules.map((rule, index) => (
                  <TableRow key={rule._id} className="hover:bg-green-50/50 transition-colors duration-200 animate-in fade-in-50" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold">{rule.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-gray-600 line-clamp-2">{rule.pattern}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={rule.active ? 'default' : 'secondary'}
                        className={rule.active ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0' : ''}
                      >
                        {rule.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(rule)}
                        className="hover:bg-green-100 hover:text-green-600 transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(rule._id)}
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
            <DialogTitle>{editingRule ? 'Edit' : 'Create'} Schedule Rule</DialogTitle>
            <DialogDescription>
              {editingRule ? 'Update' : 'Add a new'} custom scheduling pattern
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Flexible Working Hours"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern Description</Label>
                <Textarea
                  id="pattern"
                  placeholder="e.g., Core hours: 11 AM - 3 PM. Flex-in: 8-11 AM. Flex-out: 3-7 PM"
                  value={formData.pattern}
                  onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Describe the work schedule pattern, including core hours, flexible hours, and any special conditions.
                </p>
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
              <Button type="submit">{editingRule ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
