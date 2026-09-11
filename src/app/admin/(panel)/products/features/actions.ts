'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getAttributes() {
  return await prisma.attribute.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createAttribute(name: string) {
  try {
    const existing = await prisma.attribute.findUnique({
      where: { name }
    });
    if (existing) {
      return { success: false, error: 'ویژگی با این نام قبلاً وجود دارد.' };
    }
    await prisma.attribute.create({
      data: { name }
    });
    revalidatePath('/admin/products/features');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAttribute(id: string, name: string) {
  try {
    await prisma.attribute.update({
      where: { id },
      data: { name }
    });
    revalidatePath('/admin/products/features');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: 'نام تکراری است.' };
    return { success: false, error: error.message };
  }
}

export async function deleteAttribute(id: string) {
  try {
    await prisma.attribute.delete({
      where: { id }
    });
    revalidatePath('/admin/products/features');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
