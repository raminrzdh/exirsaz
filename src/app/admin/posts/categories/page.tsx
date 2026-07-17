import { prisma } from '@/lib/db/prisma';
import { CategoryListClient } from './CategoryListClient';

export default async function CategoriesPage() {
  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  const categories = dbCategories.map(c => c.name);

  return (
    <div className="space-y-6 animate-stagger-item max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">مدیریت دسته‌بندی‌ها</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <CategoryListClient initialCategories={categories} />
      </div>
    </div>
  );
}
