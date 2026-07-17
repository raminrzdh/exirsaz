'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createProduct, updateProduct } from './actions';

interface ProductFormClientProps {
  isEdit?: boolean;
  agencies: { id: string, name: string }[];
  categories: { id: string, name: string }[];
  initialData?: any;
}

export function ProductFormClient({ isEdit, agencies, categories, initialData }: ProductFormClientProps) {
  const router = useRouter();
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productType, setProductType] = useState<'SIMPLE' | 'VARIABLE'>('SIMPLE');
  
  // Attributes: [ { name: 'رنگ', valuesString: 'قرمز, آبی' } ]
  const [attributes, setAttributes] = useState<{name: string, valuesString: string}[]>([]);
  // Variants: [ { attributes: {'رنگ': 'قرمز'}, price: '100', stock: '5', sku: 'RED-1' } ]
  const [variants, setVariants] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    salePrice: '',
    stock: '0',
    sku: '',
    categoryId: '',
    salesType: 'DIRECT_SALE',
    inquiryAction: 'WHATSAPP_REDIRECT',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        shortDesc: initialData.shortDesc || '',
        price: initialData.price ? initialData.price.toString() : '',
        salePrice: initialData.salePrice ? initialData.salePrice.toString() : '',
        stock: initialData.stock ? initialData.stock.toString() : '0',
        sku: initialData.sku || '',
        categoryId: initialData.categoryId || '',
        salesType: initialData.salesType || 'DIRECT_SALE',
        inquiryAction: initialData.inquiryAction || 'WHATSAPP_REDIRECT',
      });
      setProductType(initialData.type === 'VARIABLE' ? 'VARIABLE' : 'SIMPLE');
      
      if (initialData.agencies) {
        setSelectedAgencies(initialData.agencies.map((a: any) => a.id));
      }

      if (initialData.type === 'VARIABLE' && initialData.variants) {
        // Map variants and infer attributes
        const inferredAttrs: Record<string, Set<string>> = {};
        
        const mappedVariants = initialData.variants.map((v: any) => {
          const attrs: Record<string, string> = {};
          v.attributes?.forEach((mapping: any) => {
            const attrName = mapping.attributeValue.attribute.name;
            const attrVal = mapping.attributeValue.value;
            attrs[attrName] = attrVal;
            
            if (!inferredAttrs[attrName]) inferredAttrs[attrName] = new Set();
            inferredAttrs[attrName].add(attrVal);
          });
          return {
            id: v.id,
            attributes: attrs,
            price: v.price?.toString() || '',
            stock: v.stock?.toString() || '0',
            sku: v.sku || '',
            image: v.image || ''
          };
        });

        setVariants(mappedVariants);
        setAttributes(Object.entries(inferredAttrs).map(([name, valuesSet]) => ({
          name,
          valuesString: Array.from(valuesSet).join(', ')
        })));
      }
    }
  }, [initialData]);

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', valuesString: '' }]);
  };

  const removeAttribute = (index: number) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  const generateVariants = () => {
    if (attributes.length === 0) return;
    
    // Convert to parsed array
    const parsedAttrs = attributes
      .filter(a => a.name.trim() !== '' && a.valuesString.trim() !== '')
      .map(a => ({
        name: a.name.trim(),
        values: a.valuesString.split(',').map(v => v.trim()).filter(v => v !== '')
      }));

    if (parsedAttrs.length === 0) return;

    // Cartesian product
    const getCombinations = (attrs: typeof parsedAttrs, index: number = 0): Record<string, string>[] => {
      if (index === attrs.length) return [{}];
      const result: Record<string, string>[] = [];
      const currentAttr = attrs[index];
      const subsequentCombinations = getCombinations(attrs, index + 1);

      for (const val of currentAttr.values) {
        for (const sub of subsequentCombinations) {
          result.push({ ...sub, [currentAttr.name]: val });
        }
      }
      return result;
    };

    const combinations = getCombinations(parsedAttrs);
    
    // Map existing variants to preserve price/stock if they match
    const newVariants = combinations.map(combo => {
      // Find if we already have this combo
      const existing = variants.find(v => {
        return Object.entries(combo).every(([key, val]) => v.attributes[key] === val) && 
               Object.keys(v.attributes).length === Object.keys(combo).length;
      });

      if (existing) return existing;
      
      return {
        attributes: combo,
        price: formData.price || '',
        stock: '0',
        sku: '',
        image: ''
      };
    });

    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("لطفا نام محصول را وارد کنید.");
      return;
    }
    if (productType === 'SIMPLE' && !formData.price) {
      alert("لطفا قیمت محصول را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = {
      ...formData,
      type: productType,
      agencies: selectedAgencies,
      attributes: productType === 'VARIABLE' ? attributes.map(a => ({
        name: a.name,
        values: a.valuesString.split(',').map(v => v.trim()).filter(v => !!v)
      })) : undefined,
      variants: productType === 'VARIABLE' ? variants : undefined
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateProduct(initialData.id, dataToSubmit);
    } else {
      res = await createProduct(dataToSubmit);
    }

    if (res.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert("خطا در ذخیره محصول: " + (res.error || ''));
      setIsSubmitting(false);
    }
  };

  const toggleAgency = (id: string) => {
    if (selectedAgencies.includes(id)) {
      setSelectedAgencies(selectedAgencies.filter(a => a !== id));
    } else {
      setSelectedAgencies([...selectedAgencies, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-stagger-item max-w-5xl mx-auto mb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="ghost" className="w-10 h-10 p-0 rounded-full text-slate-500 hover:bg-slate-200">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="bg-white">انصراف</Button>
          </Link>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره محصول'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">اطلاعات پایه</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">نام محصول <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثلاً: گوشی موبایل سامسونگ مدل Galaxy S24 Ultra" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کوتاه</label>
              <textarea 
                rows={3}
                value={formData.shortDesc}
                onChange={e => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="خلاصه‌ای از ویژگی‌های کلیدی محصول..."
                className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کامل (HTML/ویرایشگر متنی)</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="توضیحات کامل محصول را وارد کنید..."
                className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">نوع محصول</h2>
            </div>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${productType === 'SIMPLE' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="productType" value="SIMPLE" checked={productType === 'SIMPLE'} onChange={() => setProductType('SIMPLE')} className="sr-only" />
                <span className="font-semibold">محصول ساده</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${productType === 'VARIABLE' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="productType" value="VARIABLE" checked={productType === 'VARIABLE'} onChange={() => setProductType('VARIABLE')} className="sr-only" />
                <span className="font-semibold">محصول متغیر</span>
              </label>
            </div>
          </div>

          {productType === 'VARIABLE' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">ویژگی‌ها و متغیرها</h2>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute} className="gap-2">
                  <Plus className="w-4 h-4" /> افزودن ویژگی
                </Button>
              </div>
              
              {attributes.length > 0 ? (
                <div className="space-y-4">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-slate-500">نام ویژگی (مثال: رنگ)</label>
                        <input 
                          type="text" 
                          value={attr.name}
                          onChange={e => {
                            const newAttrs = [...attributes];
                            newAttrs[index].name = e.target.value;
                            setAttributes(newAttrs);
                          }}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div className="flex-[2] space-y-2">
                        <label className="text-xs font-semibold text-slate-500">مقادیر (با کاما جدا کنید)</label>
                        <input 
                          type="text" 
                          value={attr.valuesString}
                          onChange={e => {
                            const newAttrs = [...attributes];
                            newAttrs[index].valuesString = e.target.value;
                            setAttributes(newAttrs);
                          }}
                          placeholder="قرمز, آبی, سبز"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div className="pt-7">
                        <button type="button" onClick={() => removeAttribute(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={generateVariants} className="bg-slate-900 text-white hover:bg-slate-800">
                      تولید ترکیبات متغیرها
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">هیچ ویژگی ثبت نشده است. روی "افزودن ویژگی" کلیک کنید.</div>
              )}

              {variants.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">متغیرهای تولید شده ({variants.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">ترکیب</th>
                          <th className="p-3 w-32">قیمت (تومان)</th>
                          <th className="p-3 w-24">موجودی</th>
                          <th className="p-3 w-32">SKU</th>
                          <th className="p-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant, index) => (
                          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-3 font-medium text-slate-700">
                              {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(' - ')}
                            </td>
                            <td className="p-3">
                              <input 
                                type="number" 
                                value={variant.price}
                                onChange={e => {
                                  const newVars = [...variants];
                                  newVars[index].price = e.target.value;
                                  setVariants(newVars);
                                }}
                                className="w-full h-9 px-2 rounded-md border border-slate-200 font-mono text-start dir-ltr"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="number" 
                                value={variant.stock}
                                onChange={e => {
                                  const newVars = [...variants];
                                  newVars[index].stock = e.target.value;
                                  setVariants(newVars);
                                }}
                                className="w-full h-9 px-2 rounded-md border border-slate-200 font-mono text-start dir-ltr"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                value={variant.sku}
                                onChange={e => {
                                  const newVars = [...variants];
                                  newVars[index].sku = e.target.value;
                                  setVariants(newVars);
                                }}
                                className="w-full h-9 px-2 rounded-md border border-slate-200 font-mono text-start dir-ltr"
                              />
                            </td>
                            <td className="p-3">
                              <button type="button" onClick={() => {
                                const newVars = [...variants];
                                newVars.splice(index, 1);
                                setVariants(newVars);
                              }} className="text-rose-400 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">تصاویر محصول</h2>
            <div className="w-full h-48 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
              <p className="text-sm font-medium">برای آپلود تصویر کلیک کنید یا فایل را بکشید</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP تا سقف ۵ مگابایت</p>
            </div>
          </div>
          
        </div>

        {/* Right Column (Sidebar form) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">قیمت و موجودی {productType === 'VARIABLE' ? '(پیش‌فرض)' : ''}</h2>
            {productType === 'VARIABLE' && (
              <p className="text-xs text-slate-500">برای محصولات متغیر، این قیمت به عنوان پایه (مثلاً: شروع از...) نمایش داده می‌شود.</p>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">قیمت (تومان) {productType === 'SIMPLE' && <span className="text-red-500">*</span>}</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="مثلاً: ۶۸,۵۰۰,۰۰۰" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
                required={productType === 'SIMPLE'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">قیمت حراج (تومان)</label>
              <input 
                type="number" 
                value={formData.salePrice}
                onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                placeholder="در صورت عدم حراج، خالی بگذارید" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">موجودی انبار</label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">شناسه محصول (SKU)</label>
              <input 
                type="text" 
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr uppercase"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">نوع فروش و انتشار</h2>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">نوع فروش</label>
              <select 
                value={formData.salesType}
                onChange={e => setFormData({ ...formData, salesType: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="DIRECT_SALE">فروش مستقیم اینترنتی</option>
                <option value="INQUIRY">فروش با استعلام قیمت</option>
              </select>
            </div>

            {formData.salesType === 'INQUIRY' && (
              <div className="space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <label className="text-sm font-semibold text-indigo-900">نحوه استعلام قیمت</label>
                <select 
                  value={formData.inquiryAction}
                  onChange={e => setFormData({ ...formData, inquiryAction: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="WHATSAPP_REDIRECT">ارجاع به واتس‌اپ</option>
                  <option value="LEAD_FORM">نمایش فرم ثبت درخواست</option>
                  <option value="CALL_TO_PRICE">تماس مستقیم با دفتر</option>
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">وضعیت انتشار</label>
              <select className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">دسته‌بندی</label>
              <select 
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="">انتخاب کنید...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">نمایندگی‌های مجاز</h2>
            <p className="text-xs text-slate-500 mb-3">اگر نمایندگی خاصی انتخاب شود، مشتریان در شهر آن نمایندگی به جای خرید مستقیم، به نمایندگی ارجاع داده می‌شوند.</p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {agencies.map(agency => (
                <label key={agency.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{agency.name}</span>
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={selectedAgencies.includes(agency.id)}
                      onChange={() => toggleAgency(agency.id)}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAgencies.includes(agency.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedAgencies.includes(agency.id) && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              ))}
              {agencies.length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4">هیچ نمایندگی ثبت نشده است.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
