"use client";

import { useState } from 'react';
import { Edit, Trash2, Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { editCategory, removeCategory, createCategory } from '../actions';

export function CategoryListClient({ initialCategories }: { initialCategories: string[] }) {
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState('');

  const handleEdit = async (oldName: string) => {
    if (!editValue.trim() || editValue === oldName) {
      setEditingCat(null);
      return;
    }
    await editCategory(oldName, editValue.trim());
    setEditingCat(null);
  };

  const handleRemove = async (cat: string) => {
    if (confirm(`آیا از حذف دسته‌بندی "${cat}" مطمئن هستید؟ (پست‌های مرتبط بدون دسته خواهند شد)`)) {
      await removeCategory(cat);
    }
  };
  
  const handleAdd = async () => {
    if (!addValue.trim()) return;
    await createCategory(addValue.trim());
    setAddValue('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800">لیست دسته‌بندی‌ها</h2>
        <Button size="sm" className="gap-2" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          افزودن دسته‌بندی
        </Button>
      </div>
      
      <table className="w-full text-right text-sm">
        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">نام دسته‌بندی</th>
            <th className="px-6 py-4 font-semibold w-32 text-left">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          
          {isAdding && (
            <tr className="bg-indigo-50/50">
              <td className="px-6 py-3">
                <input 
                  autoFocus
                  type="text" 
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="نام دسته جدید..."
                />
              </td>
              <td className="px-6 py-3 text-left">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={handleAdd} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}

          {initialCategories.length === 0 && !isAdding && (
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-slate-500">هیچ دسته‌بندی یافت نشد</td>
            </tr>
          )}

          {initialCategories.map((cat) => (
            <tr key={cat} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-3">
                {editingCat === cat ? (
                  <input 
                    autoFocus
                    type="text" 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full max-w-sm h-9 px-3 rounded-md border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="font-medium text-slate-900">{cat}</span>
                )}
              </td>
              <td className="px-6 py-3 text-left">
                {editingCat === cat ? (
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingCat(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingCat(cat); setEditValue(cat); }} 
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemove(cat)} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
