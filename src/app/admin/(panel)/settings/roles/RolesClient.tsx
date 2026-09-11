'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createRole, updateRole, deleteRole } from './actions';

export default function RolesClient({ initialRoles, permissions }: { initialRoles: any[], permissions: any[] }) {
  const [roles, setRoles] = useState(initialRoles);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (role?: any) => {
    if (role) {
      setEditingRole(role);
      setName(role.name);
      setDescription(role.description || '');
      setSelectedPerms(role.permissions.map((p: any) => p.id));
    } else {
      setEditingRole(null);
      setName('');
      setDescription('');
      setSelectedPerms([]);
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name) {
      toast.error('لطفاً نام نقش را وارد کنید');
      return;
    }
    
    setIsSubmitting(true);
    let res;
    if (editingRole) {
      res = await updateRole(editingRole.id, { name, description, permissionIds: selectedPerms });
    } else {
      res = await createRole({ name, description, permissionIds: selectedPerms });
    }
    setIsSubmitting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(editingRole ? 'نقش با موفقیت بروز شد' : 'نقش جدید ایجاد شد');
      setIsOpen(false);
      // Wait for server revalidation to refresh data, or optimistically update
      setTimeout(() => window.location.reload(), 500); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این نقش اطمینان دارید؟')) return;
    
    const res = await deleteRole(id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('نقش حذف شد');
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPerms(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          نقش جدید
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>نام نقش</TableHead>
                <TableHead>توضیحات</TableHead>
                <TableHead>دسترسی‌ها</TableHead>
                <TableHead className="text-center">کاربران متصل</TableHead>
                <TableHead className="text-end">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {role.isSystem && <ShieldAlert className="w-4 h-4 text-blue-500" />}
                    {role.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((p: any) => (
                        <Badge variant="secondary" key={p.id} className="text-xs font-normal">
                          {p.action}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{role.permissions.length - 3} مورد دیگر
                        </Badge>
                      )}
                      {role.permissions.length === 0 && <span className="text-xs text-muted-foreground">بدون دسترسی</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role._count?.users || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openModal(role)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {!role.isSystem && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    هیچ نقشی تعریف نشده است
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[500px] font-estedad">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'ویرایش نقش' : 'ایجاد نقش جدید'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام نقش (انگلیسی یا فارسی)</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="مثلاً Editor یا مدیر محتوا" 
                disabled={editingRole?.isSystem}
              />
              {editingRole?.isSystem && (
                <p className="text-xs text-blue-500">نام نقش‌های سیستمی قابل تغییر نیست.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">توضیحات</label>
              <Input 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="شرح مختصری از وظایف این نقش" 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">دسترسی‌ها</label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => {
                      const perms = permissions.filter(p => ['MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'VIEW_ANALYTICS'].includes(p.action)).map(p => p.id);
                      setSelectedPerms(perms);
                    }}
                  >
                    مدیر فروشگاه
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => {
                      const perms = permissions.filter(p => ['MANAGE_PRODUCTS'].includes(p.action)).map(p => p.id);
                      setSelectedPerms(perms);
                    }}
                  >
                    مدیر محتوا
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 text-red-500"
                    onClick={() => setSelectedPerms([])}
                  >
                    پاک کردن
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 space-y-3 bg-slate-50 max-h-60 overflow-y-auto">
                {permissions.map((perm) => (
                  <div key={perm.id} className="flex items-start gap-3">
                    <Checkbox 
                      id={`perm-${perm.id}`}
                      checked={selectedPerms.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor={`perm-${perm.id}`}
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {perm.action}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {perm.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>انصراف</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
