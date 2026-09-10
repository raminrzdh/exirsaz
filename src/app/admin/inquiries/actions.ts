'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function updateInquiryStatus(id: string, status: string) {
  try {
    await prisma.inquiryRequest.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
