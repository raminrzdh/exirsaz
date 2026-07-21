import { getAttributes } from './actions';
import { FeaturesClient } from './FeaturesClient';

export const metadata = {
  title: 'مدیریت ویژگی‌های محصول | اکسیرساز',
};

export default async function FeaturesPage() {
  const attributes = await getAttributes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ویژگی‌های محصولات</h1>
        <p className="text-sm text-slate-500 mt-1">نام ویژگی‌ها را تعریف کنید تا در صفحه افزودن محصول از لیست انتخاب شوند.</p>
      </div>

      <FeaturesClient initialAttributes={attributes} />
    </div>
  );
}
