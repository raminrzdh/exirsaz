'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { toast } from 'react-hot-toast';

export function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    isAgencyRouted: true
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', parentId: '', isAgencyRouted: true });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('نام و آدرس اینترنتی الزامی است');
      return;
    }

    if (editingId) {
      const res = await updateCategory(editingId, formData);
      if (res.success) {
        toast.success('بروزرسانی شد');
        window.location.reload();
      } else {
        toast.error(res.error || 'خطا در بروزرسانی');
      }
    } else {
      const res = await createCategory(formData);
      if (res.success) {
        toast.success('دسته‌بندی با موفقیت اضافه شد');
        window.location.reload();
      } else {
        toast.error(res.error || 'خطا در افزودن');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return;
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success('حذف شد');
      window.location.reload();
    } else {
      toast.error(res.error || 'خطا در حذف');
    }
  };

  const openEdit = (cat: any) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      parentId: cat.parentId || '',
      isAgencyRouted: cat.isAgencyRouted
    });
    setEditingId(cat.id);
    setIsAdding(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Form Column */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
            {editingId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">نام دسته‌بندی <span className="text-rose-500">* (اجباری)</span></label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">آدرس (Slug) <span className="text-rose-500">* (اجباری)</span></label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none dir-ltr text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">دسته مادر (والد) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <select 
                value={formData.parentId}
                onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="">(هیچکدام)</option>
                {categories.filter(c => c.id !== editingId).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">توضیحات <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none resize-y text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                {editingId ? 'بروزرسانی' : 'افزودن'}
              </Button>
              {editingId && (
                <Button onClick={resetForm} variant="outline" className="px-3">
                  انصراف
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">نام دسته‌بندی</th>
                <th className="p-4">توضیحات</th>
                <th className="p-4 w-24">محصولات</th>
                <th className="p-4 w-24 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{cat.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">{cat.slug}</div>
                    {cat.parent && (
                      <div className="text-xs text-indigo-500 mt-1">زیرمجموعه: {cat.parent.name}</div>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    {cat._count?.products || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEdit(cat)} 
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">هیچ دسته‌بندی یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
