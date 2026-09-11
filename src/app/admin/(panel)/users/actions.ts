'use server'

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, roleId: string | null) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { roleId }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { error: 'خطا در بروزرسانی نقش کاربر' };
  }
}

export async function createUser(data: { phoneNumber: string, firstName?: string, lastName?: string, roleId?: string | null }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber }
    });
    
    if (existingUser) {
      return { error: 'کاربری با این شماره موبایل از قبل وجود دارد' };
    }

    await prisma.user.create({
      data: {
        phoneNumber: data.phoneNumber,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        roleId: data.roleId || null
      }
    });
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'خطا در ایجاد کاربر جدید' };
  }
}
