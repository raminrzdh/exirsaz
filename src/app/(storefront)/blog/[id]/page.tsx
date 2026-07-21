import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Eye, Tag } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { toPersianDigits } from '@/lib/utils/currency';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  
  if (!post) {
    return { title: 'پست یافت نشد' };
  }

  return { title: post.title };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

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

        </div>
      </div>
    </article>
  );
}
