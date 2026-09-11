import { prisma } from '@/lib/db/prisma';
import { CommentsClient } from './CommentsClient';

export default async function AdminPostCommentsPage() {
  const comments = await prisma.postComment.findMany({
    where: { parentId: null },
    include: {
      post: {
        select: { title: true, slug: true }
      },
      replies: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-stagger-item">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">نظرات مقالات</h1>
        <p className="text-sm text-slate-500 mt-1">مدیریت دیدگاه‌های ثبت شده برای پست‌ها و مقالات وبلاگ.</p>
      </div>
      
      <CommentsClient initialComments={comments} />
    </div>
  );
}
