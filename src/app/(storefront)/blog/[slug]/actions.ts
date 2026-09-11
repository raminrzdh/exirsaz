'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function submitCommentAction(prevState: any, formData: FormData) {
  const authorName = formData.get('authorName') as string;
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;

  if (!authorName || !content || !postId) {
    return { error: 'لطفا نام و متن دیدگاه را وارد کنید' };
  }

  if (content.length > 1000) {
    return { error: 'متن دیدگاه خیلی طولانی است' };
  }

  try {
    await prisma.postComment.create({
      data: {
        postId,
        authorName,
        content,
        isApproved: false, // Must be approved by admin
      },
    });

    revalidatePath(`/blog/[slug]`, 'page');
    return { success: true, message: 'دیدگاه شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.' };
  } catch (error) {
    console.error('Failed to submit comment', error);
    return { error: 'خطایی در ثبت دیدگاه رخ داد. لطفا دوباره تلاش کنید.' };
  }
}
