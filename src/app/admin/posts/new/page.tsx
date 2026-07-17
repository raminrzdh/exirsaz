import { PostForm } from '@/components/admin/PostForm';
import { prisma } from '@/lib/db/prisma';

export default async function NewPostPage() {
  const dbCategories = await prisma.category.findMany();
  const categories = dbCategories.map(c => c.name);
  
  return <PostForm categories={categories} />;
}
