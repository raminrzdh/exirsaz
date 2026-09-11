import { getCategories } from './actions';
import { CategoriesClient } from './CategoriesClient';

export const metadata = {
  title: 'مدیریت دسته‌بندی محصولات | اکسیرساز',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">دسته‌بندی محصولات</h1>
        <p className="text-sm text-slate-500 mt-1">دسته‌بندی‌ها را برای سازماندهی بهتر محصولات مدیریت کنید.</p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
