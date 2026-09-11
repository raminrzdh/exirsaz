'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateUserRole, createUser } from './actions';

export default function UsersClient({ initialUsers, roles }: { initialUsers: any[], roles: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async () => {
    if (!phoneNumber) {
      toast.error('شماره موبایل الزامی است');
      return;
    }
    
    setIsSubmitting(true);
    const roleId = selectedRole === 'none' ? null : selectedRole;
    const res = await createUser({ phoneNumber, firstName, lastName, roleId });
    setIsSubmitting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('کاربر با موفقیت ایجاد شد');
      setIsOpen(false);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    const newRoleId = roleId === 'none' ? null : roleId;
    const res = await updateUserRole(userId, newRoleId);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('نقش کاربر بروزرسانی شد');
      setUsers(users.map(u => u.id === userId ? { ...u, roleId: newRoleId, role: roles.find(r => r.id === newRoleId) || null } : u));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button className="gap-2" onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4" />
            کاربر جدید
          </Button>
          <DialogContent dir="rtl" className="sm:max-w-[425px] font-estedad">
            <DialogHeader>
              <DialogTitle>ایجاد کاربر جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">شماره موبایل *</label>
                <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0912..." dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">نام</label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نام خانوادگی</label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium">نقش کاربری</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">کاربر عادی (بدون دسترسی)</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>انصراف</Button>
              <Button onClick={handleCreateUser} disabled={isSubmitting}>
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>شماره موبایل</TableHead>
              <TableHead>نام و نام خانوادگی</TableHead>
              <TableHead>تاریخ ثبت نام</TableHead>
              <TableHead>نقش و سطح دسترسی</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium font-mono">{user.phoneNumber}</TableCell>
                <TableCell>
                  {user.firstName || user.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`
                    : <span className="text-muted-foreground text-sm">نامشخص</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                </TableCell>
                <TableCell>
                  <Select 
                    value={user.roleId || 'none'} 
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="انتخاب نقش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">کاربر عادی (بدون دسترسی)</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  هیچ کاربری یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
