import { notFound } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';
import { prisma } from '@/lib/db/prisma';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({ where: { id: resolvedParams.id } });
  
  if (!post) {
    notFound();
  }

  const dbCategories = await prisma.category.findMany();
  const categories = dbCategories.map(c => c.name);
  
  return <PostForm initialData={post} categories={categories} />;
}
