'use server'

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getRolesAndPermissions() {
  const roles = await prisma.role.findMany({
    include: {
      permissions: true,
      _count: {
        select: { users: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const permissions = await prisma.permission.findMany();

  return { roles, permissions };
}

export async function createRole(data: { name: string, description: string, permissionIds: string[] }) {
  try {
    await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          connect: data.permissionIds.map(id => ({ id }))
        }
      }
    });
    revalidatePath('/admin/settings/roles');
    return { success: true };
  } catch (error) {
    console.error('Error creating role:', error);
    return { error: 'خطا در ایجاد نقش. ممکن است نام نقش تکراری باشد.' };
  }
}

export async function updateRole(id: string, data: { name: string, description: string, permissionIds: string[] }) {
  try {
    const role = await prisma.role.findUnique({ where: { id } });
    if (role?.isSystem) {
      // For system roles, maybe we only allow updating permissions? Or completely prevent it.
      // Let's allow updating description and permissions for SuperAdmin but not name.
    }

    await prisma.role.update({
      where: { id },
      data: {
        name: role?.isSystem ? undefined : data.name, // Prevent renaming system roles
        description: data.description,
        permissions: {
          set: data.permissionIds.map(pid => ({ id: pid }))
        }
      }
    });
    revalidatePath('/admin/settings/roles');
    return { success: true };
  } catch (error) {
    console.error('Error updating role:', error);
    return { error: 'خطا در بروزرسانی نقش' };
  }
}

export async function deleteRole(id: string) {
  try {
    const role = await prisma.role.findUnique({ where: { id } });
    if (role?.isSystem) {
      return { error: 'نقش‌های سیستمی قابل حذف نیستند' };
    }

    await prisma.role.delete({ where: { id } });
    revalidatePath('/admin/settings/roles');
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { error: 'خطا در حذف نقش. ممکن است کاربرانی به این نقش متصل باشند.' };
  }
}
