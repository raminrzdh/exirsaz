'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createAttribute, updateAttribute, deleteAttribute } from './actions';
import { toast } from 'sonner';

export function FeaturesClient({ initialAttributes }: { initialAttributes: any[] }) {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const res = await createAttribute(newName.trim());
    if (res.success) {
      toast.success('ویژگی با موفقیت اضافه شد');
      setNewName('');
      setIsAdding(false);
      // Let server action revalidate path, we can also refresh local state if needed,
      // but revalidatePath will refetch the page data. We'll simulate optimistic update:
      setAttributes([...attributes, { id: Date.now().toString(), name: newName.trim() }]);
      window.location.reload(); // Simple sync
    } else {
      toast.error(res.error || 'خطا در افزودن ویژگی');
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    const res = await updateAttribute(editingId, editName.trim());
    if (res.success) {
      toast.success('بروزرسانی شد');
      setEditingId(null);
      window.location.reload();
    } else {
      toast.error(res.error || 'خطا در بروزرسانی');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این ویژگی اطمینان دارید؟')) return;
    const res = await deleteAttribute(id);
    if (res.success) {
      toast.success('حذف شد');
      window.location.reload();
    } else {
      toast.error(res.error || 'خطا در حذف');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in max-w-3xl">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">لیست ویژگی‌ها</h2>
        <Button onClick={() => setIsAdding(true)} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> ویژگی جدید
        </Button>
      </div>

      <div className="p-6">
        {isAdding && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <input 
              type="text" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="مثال: رنگ، وزن، مدل" 
              className="flex-1 h-10 px-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
              autoFocus
            />
            <Button onClick={handleAdd} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
              <Check className="w-4 h-4" /> تایید
            </Button>
            <Button onClick={() => { setIsAdding(false); setNewName(''); }} variant="outline" size="sm" className="text-slate-500">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {attributes.map((attr) => (
            <div key={attr.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              {editingId === attr.id ? (
                <div className="flex-1 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-indigo-200 outline-none focus:border-indigo-500 bg-white"
                    autoFocus
                  />
                  <button onClick={handleUpdate} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="font-semibold text-slate-700">{attr.name}</div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => { setEditingId(attr.id); setEditName(attr.name); }} 
                      className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(attr.id)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {attributes.length === 0 && !isAdding && (
            <div className="text-center py-8 text-slate-500">
              هیچ ویژگی ثبت نشده است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
