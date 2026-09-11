import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db/prisma';
import { Simple } from '@/components/og/simple';

export const runtime = 'nodejs'; // or 'edge' if Prisma edge client is configured
export const alt = 'تصویر مقاله وبلاگ';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  const title = post?.title || 'مجله اکسیرساز';
  const description = post?.content 
    ? post.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...'
    : 'جدیدترین اخبار تکنولوژی، بررسی‌های تخصصی و راهنمای خرید جامع';
    
  return new ImageResponse(
    (
      <Simple
        title={title}
        description={description}
        label={post?.category || 'مقاله'}
        brand="اکسیرساز"
      />
    ),
    {
      ...size,
    }
  );
}
