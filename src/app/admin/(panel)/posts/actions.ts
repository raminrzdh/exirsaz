'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export async function createPost(data: { title: string; content: string; category: string; status: string; thumbnail?: string; slug?: string; allowComments?: boolean }) {
  if (!data.title) {
    throw new Error('Title is required');
  }
  
  await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug || data.title.replace(/\s+/g, '-').toLowerCase(),
      content: data.content,
      category: data.category || 'بدون دسته‌بندی',
      status: data.status,
      thumbnail: data.thumbnail,
      allowComments: data.allowComments !== false,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
    }
  });

  revalidatePath('/admin/posts');
  return { success: true };
}

export async function updatePost(id: string, data: { title: string; content: string; category: string; status: string; thumbnail?: string; slug?: string; allowComments?: boolean }) {
  if (!data.title) {
    throw new Error('Title is required');
  }
  
  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      category: data.category || 'بدون دسته‌بندی',
      status: data.status,
      thumbnail: data.thumbnail,
      allowComments: data.allowComments !== false,
    }
  });

  revalidatePath('/admin/posts');
  return { success: true };
}

export async function createCategory(category: string) {
  if (!category) return { success: false };
  
  // Create a slug from the name
  const slug = category.replace(/\s+/g, '-').toLowerCase();
  
  try {
    await prisma.category.create({
      data: {
        name: category,
        slug: slug
      }
    });
  } catch (e) {
    // might exist
  }
  
  revalidatePath('/admin/posts');
  revalidatePath('/admin/posts/new');
  revalidatePath('/admin/posts/categories');
  
  return { success: true };
}

export async function editCategory(oldName: string, newName: string) {
  if (!oldName || !newName) return { success: false };
  
  const category = await prisma.category.findFirst({ where: { name: oldName } });
  if (category) {
    const slug = newName.replace(/\s+/g, '-').toLowerCase();
    await prisma.category.update({
      where: { id: category.id },
      data: { name: newName, slug }
    });
    
    // update posts as well
    await prisma.post.updateMany({
      where: { category: oldName },
      data: { category: newName }
    });
  }
  
  revalidatePath('/admin/posts');
  revalidatePath('/admin/posts/new');
  revalidatePath('/admin/posts/categories');
  return { success: true };
}

export async function removeCategory(categoryName: string) {
  if (!categoryName) return { success: false };
  
  const category = await prisma.category.findFirst({ where: { name: categoryName } });
  if (category) {
    await prisma.category.delete({ where: { id: category.id } });
    
    await prisma.post.updateMany({
      where: { category: categoryName },
      data: { category: '' }
    });
  }
  
  revalidatePath('/admin/posts');
  revalidatePath('/admin/posts/new');
  revalidatePath('/admin/posts/categories');
  return { success: true };
}

export async function getMediaFiles() {
  const { readdir, stat } = await import('fs/promises');
  const { join } = await import('path');
  const uploadDir = join(process.cwd(), 'public/uploads');
  
  try {
    const filenames = await readdir(uploadDir);
    const fileStats = await Promise.all(
      filenames.map(async (filename) => {
        const stats = await stat(join(uploadDir, filename));
        return {
          name: filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          date: stats.mtime
        };
      })
    );
    return fileStats.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    return [];
  }
}

export async function deleteMediaFile(filename: string) {
  if (!filename) return { success: false, error: 'نام فایل نامعتبر است' };
  
  const { unlink } = await import('fs/promises');
  const { join } = await import('path');
  const filePath = join(process.cwd(), 'public/uploads', filename);
  
  try {
    await unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error('Delete Media Error:', error);
    return { success: false, error: 'خطا در حذف فایل' };
  }
}
