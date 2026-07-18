'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteAgency } from './actions';
import { AgencyFormModal } from './AgencyFormModal';

export interface Agency {
  id: string;
  name: string;
  slug: string;
  company: string;
  manager: string;
  mobile: string;
  image: string;
  description: string;
  phone: string;
  address: string;
  cities: { province: string; city: string }[];
  categories: string[];
  products: string[];
  isActive: boolean;
}

interface AgencyTableClientProps {
  initialAgencies: Agency[];
  allCategories: string[];
  allProducts: { id: string, name: string }[];
  allLocations: Record<string, string[]>;
}

export function AgencyTableClient({ initialAgencies, allCategories, allProducts, allLocations }: AgencyTableClientProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | undefined>(undefined);

  const filteredAgencies = agencies.filter(a => 
    a.name.includes(searchQuery) || a.phone.includes(searchQuery)
  );

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingAgency(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این نمایندگی اطمینان دارید؟')) {
      await deleteAgency(id);
      setAgencies(agencies.filter(a => a.id !== id));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50">
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="جستجو در نمایندگی‌ها (نام یا تلفن)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl bg-white border border-slate-200 px-4 pe-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute end-3 top-3" />
        </div>
        
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto h-10 gap-2">
          <Plus className="w-4 h-4" />
          افزودن نمایندگی جدید
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">استان (URL)</th>
              <th className="px-6 py-4">نام نمایندگی / تلفن</th>
              <th className="px-6 py-4">شهرهای تحت پوشش</th>
              <th className="px-6 py-4">دسته‌بندی‌های اختصاصی</th>
              <th className="px-6 py-4">وضعیت</th>
              <th className="px-6 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAgencies.map(agency => (
              <tr key={agency.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 mb-1" dir="ltr">/{agency.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 mb-1">{agency.name}</div>
                  <div className="text-slate-500 font-mono text-xs">{agency.phone || agency.mobile}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {agency.cities.slice(0, 2).map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[11px] font-medium border border-indigo-100">
                        <MapPin className="w-3 h-3" />
                        {c.city}
                      </span>
                    ))}
                    {agency.cities.length > 2 && (
                      <span className="inline-flex items-center bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[11px] font-medium">
                        +{agency.cities.length - 2} شهر
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {agency.categories.length === 0 ? (
                    <span className="text-slate-500 text-xs">همه محصولات</span>
                  ) : (
                    <div className="text-xs text-slate-600 truncate max-w-[150px]" title={agency.categories.join(', ')}>
                      {agency.categories.join('، ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {agency.isActive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-100">
                      <XCircle className="w-3.5 h-3.5" />
                      غیرفعال
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(agency)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(agency.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredAgencies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  هیچ نمایندگی با این مشخصات یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AgencyFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        agency={editingAgency}
        allCategories={allCategories}
        allProducts={allProducts}
        allLocations={allLocations}
        onSuccess={(updatedAgency) => {
          if (editingAgency) {
            setAgencies(agencies.map(a => a.id === updatedAgency.id ? updatedAgency : a));
          } else {
            setAgencies([updatedAgency, ...agencies]);
          }
        }}
      />
    </div>
  );
}
