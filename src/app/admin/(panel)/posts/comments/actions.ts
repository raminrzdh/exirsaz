'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export async function approvePostComment(id: string) {
  try {
    await prisma.postComment.update({
      where: { id },
      data: { isApproved: true }
    });
    revalidatePath('/admin/posts/comments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در تایید نظر' };
  }
}

export async function deletePostComment(id: string) {
  try {
    await prisma.postComment.delete({
      where: { id }
    });
    revalidatePath('/admin/posts/comments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در حذف نظر' };
  }
}

export async function replyToPostComment(parentId: string, postId: string, content: string) {
  try {
    await prisma.postComment.create({
      data: {
        postId,
        parentId,
        content,
        authorName: 'مدیریت سایت',
        isApproved: true
      }
    });
    revalidatePath('/admin/posts/comments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در ثبت پاسخ' };
  }
}

export async function editPostComment(id: string, content: string) {
  try {
    await prisma.postComment.update({
      where: { id },
      data: { content }
    });
    revalidatePath('/admin/posts/comments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در ویرایش نظر' };
  }
}

