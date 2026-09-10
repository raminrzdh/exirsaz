'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, MapPin, Trash2, Phone, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createAgency, updateAgency } from './actions';
import { Agency } from './AgencyTableClient';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/storefront/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-slate-100 rounded-xl animate-pulse text-slate-400">در حال بارگذاری نقشه...</div>
});


interface AgencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency?: Agency;
  allCategories: string[];
  allProducts: { id: string, name: string }[];
  allLocations: Record<string, string[]>;
  onSuccess: (agency: Agency) => void;
}



export function AgencyFormModal({ isOpen, onClose, agency, allCategories, allProducts, allLocations, onSuccess }: AgencyFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Agency>>({
    name: '',
    phone: '',
    address: '',
    cities: [],
    categories: [],
    isActive: true,
    hasWhatsapp: true,
    whatsappNumber: '',
    hasBale: false,
    baleNumber: '',
    hasPhoneCall: true,
    phoneCallNumber: '',
    hasRequestForm: true,
    locationCoordinates: ''
  });

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    if (agency) {
      setFormData(agency);
    } else {
      setFormData({
        name: '',
        slug: '',
        company: '',
        manager: '',
        mobile: '',
        image: '',
        description: '',
        phone: '',
        address: '',
        cities: [],
        categories: [],
        products: [],
        isActive: true,
        hasWhatsapp: true,
        whatsappNumber: '',
        hasBale: false,
        baleNumber: '',
        hasPhoneCall: true,
        phoneCallNumber: '',
        hasRequestForm: true,
        locationCoordinates: ''
      });
    }
    setSelectedProvince('');
    setSelectedCity('');
  }, [agency, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.cities?.length) {
      toast.error('لطفا فیلدهای ضروری (نام، تلفن و حداقل یک شهر) را پر کنید.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (agency?.id) {
        const res = await updateAgency(agency.id, formData as Partial<Agency>);
        if (res.success) onSuccess(res.agency);
      } else {
        const res = await createAgency(formData as Omit<Agency, 'id'>);
        if (res.success) onSuccess(res.agency);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('خطا در ذخیره اطلاعات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCity = () => {
    if (selectedProvince && selectedCity) {
      const exists = formData.cities?.some(c => c.province === selectedProvince && c.city === selectedCity);
      if (!exists) {
        setFormData({
          ...formData,
          cities: [...(formData.cities || []), { province: selectedProvince, city: selectedCity }]
        });
      }
      setSelectedCity('');
    }
  };

  const removeCity = (index: number) => {
    const newCities = [...(formData.cities || [])];
    newCities.splice(index, 1);
    setFormData({ ...formData, cities: newCities });
  };

  const toggleCategory = (cat: string) => {
    const cats = formData.categories || [];
    if (cats.includes(cat)) {
      setFormData({ ...formData, categories: cats.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...cats, cat] });
    }
  };

  const toggleProduct = (productId: string) => {
    const prods = formData.products || [];
    if (prods.includes(productId)) {
      setFormData({ ...formData, products: prods.filter(p => p !== productId) });
    } else {
      setFormData({ ...formData, products: [...prods, productId] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {agency ? 'ویرایش نمایندگی' : 'افزودن نمایندگی جدید'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">نام نمایشی (استان / منطقه) *</label>
              <input 
                type="text" 
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="مثال: آذربایجان شرقی (تبریز)"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">اسلاگ URL (نامک) *</label>
              <input 
                type="text" 
                value={formData.slug || ''}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-left"
                placeholder="azerbaijan-sharghi"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">نام شرکت / فروشگاه</label>
              <input 
                type="text" 
                value={formData.company || ''}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">نام مدیریت</label>
              <input 
                type="text" 
                value={formData.manager || ''}
                onChange={e => setFormData({ ...formData, manager: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">تلفن ثابت</label>
              <input 
                type="text" 
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-right"
                placeholder="021..."
                dir="ltr"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">تلفن همراه</label>
              <input 
                type="text" 
                value={formData.mobile || ''}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-mono focus:border-indigo-500 outline-none text-right"
                placeholder="0912..."
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">آدرس کامل مراجعه حضوری</label>
            <input 
              type="text" 
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">آدرس تصویر (URL)</label>
            <input 
              type="text" 
              value={formData.image || ''}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 outline-none"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">توضیحات (درباره نمایندگی)</label>
            <textarea 
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4">
            <label className="text-sm font-bold text-slate-800 block">شهرهای تحت پوشش *</label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select 
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setSelectedCity(''); }}
                className="flex-1 h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 outline-none"
              >
                <option value="">انتخاب استان...</option>
                {Object.keys(allLocations).sort().map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>

              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince}
                className="flex-1 h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-500 outline-none disabled:bg-slate-100"
              >
                <option value="">انتخاب شهر...</option>
                {selectedProvince && allLocations[selectedProvince]?.sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <Button type="button" onClick={addCity} disabled={!selectedCity} className="h-11 bg-indigo-600 px-4 gap-2">
                <Plus className="w-4 h-4" />
                افزودن
              </Button>
            </div>

            {formData.cities && formData.cities.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.cities.map((city, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-sm shadow-sm">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{city.province} - {city.city}</span>
                    <button type="button" onClick={() => removeCity(idx)} className="text-slate-400 hover:text-rose-500 pr-2 border-r border-indigo-50 ml-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-rose-500">حداقل یک شهر باید انتخاب شود.</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 block">دسته‌بندی‌های اختصاصی</label>
            <p className="text-xs text-slate-500 mb-2">اگر هیچ دسته‌ای انتخاب نشود، نمایندگی برای تمام محصولات شهر فعال خواهد بود.</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    formData.categories?.includes(cat) 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 block">محصولات اختصاصی</label>
            <p className="text-xs text-slate-500 mb-2">محصولات خاصی را به این نمایندگی لینک کنید. (اولویت بالاتر از دسته‌بندی)</p>
            <div className="flex flex-wrap gap-2">
              {allProducts.map(prod => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => toggleProduct(prod.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    formData.products?.includes(prod.id) 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? '-translate-x-6' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">نمایندگی فعال است</span>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-800 block">راه‌های ارتباطی در سایت</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.hasPhoneCall ?? true} onChange={e => setFormData({...formData, hasPhoneCall: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> تماس تلفنی</span>
                </label>
                {(formData.hasPhoneCall ?? true) && (
                  <input 
                    type="text" 
                    value={formData.phoneCallNumber || ''} 
                    onChange={e => setFormData({...formData, phoneCallNumber: e.target.value})} 
                    placeholder="شماره تماس..."
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none text-left" 
                    dir="ltr"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.hasWhatsapp ?? true} onChange={e => setFormData({...formData, hasWhatsapp: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-500" /> واتس‌اپ</span>
                </label>
                {(formData.hasWhatsapp ?? true) && (
                  <input 
                    type="text" 
                    value={formData.whatsappNumber || ''} 
                    onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} 
                    placeholder="شماره واتس‌اپ..."
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 outline-none text-left" 
                    dir="ltr"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.hasBale ?? false} onChange={e => setFormData({...formData, hasBale: e.target.checked})} className="w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-slate-400" /> پیام‌رسان بله</span>
                </label>
                {(formData.hasBale ?? false) && (
                  <input 
                    type="text" 
                    value={formData.baleNumber || ''} 
                    onChange={e => setFormData({...formData, baleNumber: e.target.value})} 
                    placeholder="شماره بله..."
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-teal-500 outline-none text-left" 
                    dir="ltr"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.hasRequestForm ?? true} onChange={e => setFormData({...formData, hasRequestForm: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> فرم ثبت درخواست</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-800 block">موقعیت روی نقشه (برای مسیریابی کاربر)</label>
            <p className="text-xs text-slate-500 mb-2">در صورت انتخاب، دکمه مسیریابی برای کاربران فعال می‌شود.</p>
            <div className="w-full h-[250px] relative rounded-xl border border-slate-200 overflow-hidden z-0">
              <MapPicker 
                onLocationSelect={(lat, lng) => setFormData({...formData, locationCoordinates: `${lat},${lng}`})} 
              />
              {formData.locationCoordinates && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-mono z-[1000] border border-slate-200 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓ ثبت شد</span>
                  <span className="text-slate-500">{formData.locationCoordinates}</span>
                  <button type="button" onClick={() => setFormData({...formData, locationCoordinates: ''})} className="text-rose-500 hover:text-rose-700 mr-2 border-r border-slate-200 pr-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            انصراف
          </Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 gap-2 min-w-[120px]" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ذخیره...' : (
              <>
                <Save className="w-4 h-4" />
                ذخیره اطلاعات
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
