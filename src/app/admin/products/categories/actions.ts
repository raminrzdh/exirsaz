'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createCategory(data: { name: string; slug: string; description?: string; parentId?: string; isAgencyRouted?: boolean }) {
  try {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug }
    });
    if (existing) {
      return { success: false, error: 'این آدرس (Slug) قبلاً استفاده شده است.' };
    }
    
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        isAgencyRouted: data.isAgencyRouted ?? true
      }
    });
    
    revalidatePath('/admin/products/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; parentId?: string; isAgencyRouted?: boolean }) {
  try {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug }
    });
    if (existing && existing.id !== id) {
      return { success: false, error: 'این آدرس (Slug) توسط دسته دیگری استفاده شده است.' };
    }

    if (data.parentId === id) {
      return { success: false, error: 'یک دسته نمی‌تواند زیرمجموعه خودش باشد.' };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        isAgencyRouted: data.isAgencyRouted ?? true
      }
    });
    
    revalidatePath('/admin/products/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } }
    });

    if (!category) return { success: false, error: 'یافت نشد' };
    
    if (category._count.products > 0) {
      return { success: false, error: 'این دسته دارای محصول است و نمیتوان آن را حذف کرد. ابتدا محصولات را منتقل کنید.' };
    }
    if (category._count.children > 0) {
      return { success: false, error: 'این دسته دارای زیردسته است. ابتدا زیردسته‌ها را حذف یا منتقل کنید.' };
    }

    await prisma.category.delete({
      where: { id }
    });
    
    revalidatePath('/admin/products/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
