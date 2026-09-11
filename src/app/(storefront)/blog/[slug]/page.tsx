import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Eye, Tag } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { toPersianDigits } from '@/lib/utils/currency';
import { Metadata } from 'next';
import { BlogCommentForm } from '@/components/storefront/BlogCommentForm';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post) {
    return { title: 'پست یافت نشد' };
  }

  return { title: post.title };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ 
    where: { slug },
    include: {
      comments: {
        where: { isApproved: true, parentId: null },
        include: { replies: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!post || post.status !== 'published') {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: [{
      '@type': 'Person',
      name: 'مدیریت اکسیرساز',
      url: 'https://exirsaz.com/about'
    }],
    publisher: {
      '@type': 'Organization',
      name: 'فروشگاه اکسیرساز شمال',
      logo: {
        '@type': 'ImageObject',
        url: 'https://exirsaz.com/logo.png'
      }
    }
  };

  return (
    <article className="min-h-screen bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative py-20 px-4">
        {post.thumbnail && (
          <>
            <div className="absolute inset-0 bg-slate-900/80 z-10" />
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover opacity-40"
              unoptimized
            />
          </>
        )}
        <header className="container mx-auto max-w-4xl relative z-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors mb-8 font-medium">
            <ArrowRight className="w-4 h-4" />
            بازگشت به مجله
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-slate-300 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 text-sm">
              <Eye className="w-4 h-4" />
              <span>{toPersianDigits(post.views.toString())} بازدید</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {post.title}
          </h1>
        </header>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">

          {post.thumbnail && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 border border-slate-100 shadow-sm">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <section
            className="prose prose-slate prose-lg prose-indigo prose-rtl max-w-none prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Comments Section */}
          {post.allowComments && (
            <div className="mt-16 pt-10 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">نظرات کاربران</h3>
              
              <BlogCommentForm postId={post.id} />

              <div className="space-y-6">
                {post.comments.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">هنوز دیدگاهی برای این مقاله ثبت نشده است. اولین نفر باشید!</p>
                ) : (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                      
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ms-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="mb-3 last:mb-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-indigo-700 text-sm">{reply.authorName}</span>
                                <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                              <p className="text-slate-600 text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
