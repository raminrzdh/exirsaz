import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db/prisma';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-stagger-item">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">محتوا و مقالات (وبلاگ)</h1>
          <p className="text-sm text-slate-500 mt-1">مدیریت مقالات، اخبار و محتوای آموزشی سایت.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="gap-2 shrink-0">
            <Plus className="w-5 h-5" />
            افزودن مقاله جدید
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="جستجو در عناوین..." 
            className="w-full h-10 ps-10 pe-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-start">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">عنوان مقاله</th>
              <th className="px-6 py-4 font-semibold text-start">دسته‌بندی</th>
              <th className="px-6 py-4 font-semibold text-start">وضعیت</th>
              <th className="px-6 py-4 font-semibold text-start">تاریخ</th>
              <th className="px-6 py-4 font-semibold text-end">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{post.title}</td>
                <td className="px-6 py-4">{post.category}</td>
                <td className="px-6 py-4">
                  {post.status === 'published' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">منتشر شده</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">پیش‌نویس</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">{post.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}`}>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
