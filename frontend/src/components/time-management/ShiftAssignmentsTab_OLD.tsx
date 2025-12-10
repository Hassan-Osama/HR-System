'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Edit, Trash2, User, Building2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShiftAssignment {
  _id: string;
  employeeId?: { _id: string; firstName: string; lastName: string; employeeNumber: string };
  departmentId?: { _id: string; name: string };
  positionId?: { _id: string; title: string };
  shiftId?: { _id: string; name: string };
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'EXPIRED';
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface ShiftType {
  _id: string;
  name: string;
}

export default function ShiftAssignmentsTab() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ShiftAssignment | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    startDate: '',
    endDate: '',
    status: 'PENDING' as const,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [assignmentsRes, employeesRes, shiftTypesRes] = await Promise.all([
        fetch('http://localhost:3000/time-management/shifts', { headers }),
        fetch('http://localhost:3000/api/employee-profile', { headers }),
        fetch('http://localhost:3000/time-management/shift-types', { headers }),
      ]);

      if (!assignmentsRes.ok || !employeesRes.ok || !shiftTypesRes.ok) {
        throw new Error('Failed to fetch required data');
      }

      const assignmentsData = await assignmentsRes.json();
      const employeesData = await employeesRes.json();
      const shiftTypesData = await shiftTypesRes.json();

      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setEmployees(employeesData.data || []);
      setShiftTypes(Array.isArray(shiftTypesData) ? shiftTypesData : []);
    } catch (error: any) {
      console.error('Fetch data error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId) {
      toast({ title: 'Validation Error', description: 'Please select an employee', variant: 'destructive' });
      return;
    }
    if (!formData.shiftId) {
      toast({ title: 'Validation Error', description: 'Please select a shift type', variant: 'destructive' });
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast({ title: 'Validation Error', description: 'Start and end dates are required', variant: 'destructive' });
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({ title: 'Validation Error', description: 'End date must be after start date', variant: 'destructive' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch('http://localhost:3000/time-management/shifts/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to assign shift');
      }

      toast({ title: 'Success', description: 'Shift assigned successfully' });
      setDialogOpen(false);
      setFormData({ employeeId: '', shiftId: '', startDate: '', endDate: '', status: 'PENDING' });
      fetchData();
    } catch (error: any) {
      console.error('Assign shift error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign shift. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedAssignment) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch(
        `http://localhost:3000/time-management/shifts/${selectedAssignment._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      toast({ title: 'Success', description: `Status updated to ${newStatus}` });
      setStatusDialogOpen(false);
      setSelectedAssignment(null);
      fetchData();
    } catch (error: any) {
      console.error('Update status error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'Authentication Error', description: 'Please login first', variant: 'destructive' });
        return;
      }

      const response = await fetch(`http://localhost:3000/time-management/shifts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete shift assignment');
      }

      toast({ title: 'Success', description: 'Shift assignment deleted successfully' });
      fetchData();
    } catch (error: any) {
      console.error('Delete assignment error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete assignment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; className: string }> = {
      APPROVED: { 
        variant: 'default', 
        className: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0' 
      },
      PENDING: { 
        variant: 'secondary', 
        className: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0' 
      },
      CANCELLED: { 
        variant: 'destructive', 
        className: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0' 
      },
      EXPIRED: { 
        variant: 'outline', 
        className: 'bg-gradient-to-r from-gray-400 to-slate-500 hover:from-gray-500 hover:to-slate-600 text-white border-0' 
      },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shift Assignments
            </CardTitle>
            <CardDescription className="text-base">Assign shifts to employees, departments, or positions</CardDescription>
          </div>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign Shift
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading assignments...</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/80">
                <TableHead className="font-semibold">Assignee</TableHead>
                <TableHead className="font-semibold">Shift Type</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">End Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No shift assignments found</p>
                    <p className="text-sm">Create one to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment, index) => (
                  <TableRow key={assignment._id} className="hover:bg-purple-50/50 transition-colors duration-200 animate-in fade-in-50" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell className="font-medium">
                      {assignment.employeeId && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                            <User className="h-4 w-4 text-purple-600" />
                          </div>
                          {assignment.employeeId.firstName} {assignment.employeeId.lastName}
                          <span className="text-muted-foreground text-sm">
                            ({assignment.employeeId.employeeNumber})
                          </span>
                        </div>
                      )}
                      {assignment.departmentId && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold">{assignment.departmentId.name}</span>
                        </div>
                      )}
                      {assignment.positionId && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg">
                            <Briefcase className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="font-semibold">{assignment.positionId.title}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell><span className="font-semibold">{assignment.shiftId?.name || 'N/A'}</span></TableCell>
                    <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(assignment.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setStatusDialogOpen(true);
                        }}
                        className="hover:bg-purple-100 hover:text-purple-600 transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(assignment._id)}
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
            <DialogTitle>Assign Shift</DialogTitle>
            <DialogDescription>Assign a shift to an employee</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift Type</Label>
                  <Select value={formData.shiftId} onValueChange={(value) => setFormData({ ...formData, shiftId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift type" />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftTypes.map((shift) => (
                        <SelectItem key={shift._id} value={shift._id}>
                          {shift.name}
                        </SelectItem>
                      ))}
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
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign Shift</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shift Status</DialogTitle>
            <DialogDescription>Change the status of this shift assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleStatusUpdate('APPROVED')} variant="default">
                Approve
              </Button>
              <Button onClick={() => handleStatusUpdate('PENDING')} variant="secondary">
                Set Pending
              </Button>
              <Button onClick={() => handleStatusUpdate('CANCELLED')} variant="destructive">
                Cancel
              </Button>
              <Button onClick={() => handleStatusUpdate('EXPIRED')} variant="outline">
                Mark Expired
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
