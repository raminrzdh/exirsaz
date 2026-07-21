import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ suggestions: [] });
    }

    // Strip HTML tags for clean text matching if necessary, 
    // but preserving original structure to help the user identify where the phrase is.
    const plainText = content.replace(/<[^>]+>/g, ' ');

    // Fetch products and posts
    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        select: { name: true, slug: true, category: { select: { name: true } } },
      }),
      prisma.post.findMany({
        where: { status: 'published' },
        select: { title: true, id: true },
      }),
    ]);

    const suggestions: { text: string; url: string; type: 'product' | 'post' }[] = [];
    const addedUrls = new Set<string>();

    const checkMatch = (phrase: string, url: string, type: 'product' | 'post') => {
      // Avoid suggesting very short common words or duplicates
      if (phrase.length < 4 || addedUrls.has(url)) return;

      // Simple string inclusion check on plain text
      // We will prefer the exact includes if it's in the text
      if (plainText.includes(phrase)) {
        suggestions.push({ text: phrase, url, type });
        addedUrls.add(url);
      }
    };

    // Check Products
    for (const p of products) {
      checkMatch(p.name, `/products/${p.slug}`, 'product');
    }

    // Check Posts
    for (const post of posts) {
      checkMatch(post.title, `/blog/${post.id}`, 'post');
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Internal Linking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
