import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, Eye, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { toPersianDigits } from '@/lib/utils/currency';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-12 bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-slate-900/40" />
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">مجله اکسیرساز</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            جدیدترین اخبار تکنولوژی، بررسی‌های تخصصی و راهنمای خرید جامع
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-xl">هنوز مقاله‌ای منتشر نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {post.thumbnail ? (
                  <Image 
                    src={post.thumbnail} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                
                <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{toPersianDigits(post.views.toString())} بازدید</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
