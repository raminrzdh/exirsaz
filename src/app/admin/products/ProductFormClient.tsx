'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Image as ImageIcon, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createProduct, updateProduct } from './actions';
import { toast } from 'react-hot-toast';
import { InternalLinkingWidget } from '@/components/admin/InternalLinkingWidget';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import Image from 'next/image';



interface ProductFormClientProps {
  isEdit?: boolean;
  agencies: { id: string, name: string }[];
  categories: { id: string, name: string }[];
  availableFeatures?: string[];
  initialData?: any;
}

export function ProductFormClient({ isEdit, agencies, categories, availableFeatures, initialData }: ProductFormClientProps) {
  const router = useRouter();
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productType, setProductType] = useState<'SIMPLE' | 'VARIABLE'>('SIMPLE');
  
  // Attributes: [ { name: 'رنگ', valuesString: 'قرمز, آبی' } ]
  const [attributes, setAttributes] = useState<{name: string, valuesString: string}[]>([]);
  // Variants: [ { attributes: {'رنگ': 'قرمز'}, price: '100', stock: '5', sku: 'RED-1' } ]
  const [variants, setVariants] = useState<any[]>([]);

  const [productImages, setProductImages] = useState<string[]>([]);
  const [productFeaturesList, setProductFeaturesList] = useState<{name: string, value: string}[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

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

      if (initialData.images) {
        try {
          const parsed = JSON.parse(initialData.images);
          if (Array.isArray(parsed)) setProductImages(parsed);
        } catch(e) {
          console.error("Failed to parse product images", e);
        }
      }

      if (initialData.features) {
        try {
          const parsed = JSON.parse(initialData.features);
          if (Array.isArray(parsed)) {
            setProductFeaturesList(parsed);
          }
        } catch(e) {
          console.error("Failed to parse product features", e);
        }
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
      toast.error("لطفا نام محصول را وارد کنید.");
      return;
    }
    if (productType === 'SIMPLE' && !formData.price) {
      toast.error("لطفا قیمت محصول را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    
    const featuresArray = productFeaturesList.filter(f => f.name.trim() && f.value.trim());

    const dataToSubmit = {
      ...formData,
      type: productType,
      agencies: selectedAgencies,
      images: JSON.stringify(productImages),
      features: JSON.stringify(featuresArray),
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
      toast.error("خطا در ذخیره محصول: " + (res.error || ''));
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
              <label className="text-sm font-semibold text-slate-700">نام محصول <span className="text-red-500">* (اجباری)</span></label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثلاً: توری سایبان گلخانه" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">آدرس اینترنتی (Slug) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                placeholder="مثال: greenhouse-shade-net (استفاده از حروف انگلیسی توصیه می‌شود)" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors dir-ltr text-left font-mono"
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                برای اشتراک‌گذاری راحت‌تر لینک در شبکه‌های اجتماعی و پیام‌رسان‌ها (واتس‌اپ و...) بهتر است از <strong>کلمات انگلیسی با خط تیره</strong> استفاده کنید تا آدرس‌های طولانی و ناخوانا ایجاد نشود.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کوتاه <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <textarea 
                rows={3}
                value={formData.shortDesc}
                onChange={e => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="خلاصه‌ای از ویژگی‌های کلیدی محصول..."
                className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کامل (HTML/ویرایشگر متنی) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
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



          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">ویژگی‌ها و مشخصات فنی</h2>
              <Button type="button" variant="outline" size="sm" onClick={() => setProductFeaturesList([...productFeaturesList, { name: availableFeatures?.[0] || '', value: '' }])} className="gap-2">
                <Plus className="w-4 h-4" /> افزودن ویژگی
              </Button>
            </div>
            
            <div className="space-y-3">
              {productFeaturesList.map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <select 
                    value={feature.name}
                    onChange={e => {
                      const newList = [...productFeaturesList];
                      newList[idx].name = e.target.value;
                      setProductFeaturesList(newList);
                    }}
                    className="flex-1 h-11 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  >
                    <option value="">انتخاب ویژگی...</option>
                    {availableFeatures?.map(f => (
                       <option key={f} value={f}>{f}</option>
                    ))}
                    {!availableFeatures?.includes(feature.name) && feature.name !== '' && (
                       <option value={feature.name}>{feature.name}</option>
                    )}
                  </select>
                  <input 
                    type="text" 
                    value={feature.value}
                    onChange={e => {
                      const newList = [...productFeaturesList];
                      newList[idx].value = e.target.value;
                      setProductFeaturesList(newList);
                    }}
                    placeholder="مقدار ویژگی (مثل: قرمز، 20 کیلوگرم)..."
                    className="flex-[2] h-11 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                  <button type="button" onClick={() => {
                    const newList = [...productFeaturesList];
                    newList.splice(idx, 1);
                    setProductFeaturesList(newList);
                  }} className="w-11 h-11 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {productFeaturesList.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  ویژگی برای این محصول ثبت نشده است. روی "افزودن ویژگی" کلیک کنید.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">گالری تصاویر محصول</h2>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsMediaPickerOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> افزودن عکس
              </Button>
            </div>
            
            {productImages.length === 0 ? (
              <div 
                onClick={() => setIsMediaPickerOpen(true)}
                className="w-full h-48 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm font-medium">برای انتخاب یا آپلود تصویر کلیک کنید</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productImages.map((imgUrl, idx) => (
                  <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${idx === 0 ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
                    <Image src={imgUrl} alt={`Product image ${idx+1}`} fill className="object-cover" unoptimized />
                    
                    {/* Badge for Main Image */}
                    {idx === 0 && (
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> عکس اصلی
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                      {idx !== 0 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = [...productImages];
                            const [moved] = newImages.splice(idx, 1);
                            newImages.unshift(moved);
                            setProductImages(newImages);
                          }}
                          className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                          انتخاب به عنوان اصلی
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          const newImages = [...productImages];
                          newImages.splice(idx, 1);
                          setProductImages(newImages);
                        }}
                        className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-600 transition-colors"
                      >
                        حذف عکس
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <label className="text-sm font-semibold text-slate-700">قیمت (تومان) {productType === 'SIMPLE' && <span className="text-red-500">* (اجباری)</span>}</label>
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
              <label className="text-sm font-semibold text-slate-700">قیمت حراج (تومان) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <input 
                type="number" 
                value={formData.salePrice}
                onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                placeholder="در صورت عدم حراج، خالی بگذارید" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">موجودی انبار <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">شناسه محصول (SKU) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
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
              <label className="text-sm font-semibold text-slate-700">نوع فروش <span className="text-red-500">* (اجباری)</span></label>
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
                <label className="text-sm font-semibold text-indigo-900">نحوه استعلام قیمت <span className="text-red-500">* (اجباری)</span></label>
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
              <label className="text-sm font-semibold text-slate-700">وضعیت انتشار <span className="text-red-500">* (اجباری)</span></label>
              <select className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">دسته‌بندی <span className="text-slate-400 font-normal">(اختیاری)</span></label>
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
          
          <InternalLinkingWidget content={formData.description || formData.shortDesc} />

        </div>
      </div>
      
      <MediaPickerModal 
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(data) => {
          setProductImages([...productImages, data.url]);
        }}
        requireSeo={false}
      />
    </form>
  );
}
