"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, CheckCircle2, AlertCircle, RefreshCw, X, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { createPost, updatePost, createCategory } from '@/app/admin/posts/actions';
import { MediaPickerModal } from './MediaPickerModal';

export interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    category: string;
    status: 'published' | 'draft' | 'archived';
    thumbnail?: string;
  };
  categories: string[];
}

export function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  
  const [seoScore, setSeoScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState([
    { id: 'title-len', label: 'طول عنوان سئو مناسب است (۵۰-۶۰ کاراکتر)', passed: false },
    { id: 'desc-len', label: 'طول توضیحات متا مناسب است (۱۵۰-۱۶۰ کاراکتر)', passed: false },
    { id: 'keyword-title', label: 'کلمه کلیدی در عنوان وجود دارد', passed: false },
    { id: 'keyword-desc', label: 'کلمه کلیدی در توضیحات متا وجود دارد', passed: false },
    { id: 'keyword-content', label: 'کلمه کلیدی در محتوا تکرار شده است (چگالی > ۱٪)', passed: false },
    { id: 'content-len', label: 'محتوا حداقل ۳۰۰ کلمه است', passed: false },
  ]);

  // Real-time SEO Analyzer Logic
  useEffect(() => {
    let score = 0;
    let passedCount = 0;
    const checks = [...seoChecks];

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const keywordMatches = focusKeyword ? (content.match(new RegExp(focusKeyword, 'gi')) || []).length : 0;
    const keywordDensity = wordCount > 0 ? (keywordMatches / wordCount) * 100 : 0;

    // 1. Meta Title Length (Ideal: 50-60)
    checks[0].passed = metaTitle.length >= 40 && metaTitle.length <= 60;
    if (checks[0].passed) passedCount++;

    // 2. Meta Desc Length (Ideal: 120-160)
    checks[1].passed = metaDesc.length >= 120 && metaDesc.length <= 160;
    if (checks[1].passed) passedCount++;

    // 3. Keyword in Title
    checks[2].passed = focusKeyword.length > 0 && metaTitle.includes(focusKeyword);
    if (checks[2].passed) passedCount++;

    // 4. Keyword in Desc
    checks[3].passed = focusKeyword.length > 0 && metaDesc.includes(focusKeyword);
    if (checks[3].passed) passedCount++;

    // 5. Keyword Density in Content
    checks[4].passed = focusKeyword.length > 0 && keywordDensity >= 1 && keywordDensity <= 3;
    if (checks[4].passed) passedCount++;

    // 6. Content Length
    checks[5].passed = wordCount >= 300;
    if (checks[5].passed) passedCount++;

    setSeoChecks(checks);
    setSeoScore(Math.round((passedCount / checks.length) * 100));
  }, [title, content, metaTitle, metaDesc, focusKeyword]);

  const savePost = async (status: 'published' | 'draft') => {
    if (!title) {
      alert('لطفاً عنوان مقاله را وارد کنید.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updatePost(initialData.id, { title, content, category, status, thumbnail });
        alert(status === 'published' ? 'تغییرات با موفقیت منتشر شد!' : 'تغییرات به عنوان پیش‌نویس ذخیره شد.');
      } else {
        await createPost({ title, content, category, status, thumbnail });
        alert(status === 'published' ? 'مقاله با موفقیت منتشر شد!' : 'مقاله به عنوان پیش‌نویس ذخیره شد.');
      }
      router.push('/admin/posts');
    } catch (error) {
      alert('خطا در ذخیره مقاله.');
      setIsSubmitting(false);
    }
  };

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-600';
    if (seoScore >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = () => {
    if (seoScore >= 80) return 'bg-green-100';
    if (seoScore >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6 animate-stagger-item max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" className="w-10 h-10 p-0 rounded-full text-slate-500 hover:bg-slate-200">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {initialData ? 'ویرایش مطلب' : 'نوشتن مطلب جدید'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white" disabled={isSubmitting} onClick={() => savePost('draft')}>
            پیش‌نویس
          </Button>
          <Button className="gap-2" disabled={isSubmitting} onClick={() => savePost('published')}>
            <Save className="w-4 h-4" />
            انتشار مطلب
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Editor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <input 
              type="text" 
              placeholder="عنوان مطلب در اینجا..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold placeholder-slate-300 border-none outline-none bg-transparent"
            />
            
            <div className="h-px w-full bg-slate-100 my-4" />
            
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              placeholder="محتوای مقاله خود را اینجا بنویسید..." 
            />
          </div>
        </div>

        {/* SEO Optimizer & Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Featured Image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">تصویر شاخص</h2>
            
            {thumbnail ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={thumbnail} alt="Thumbnail" className="object-cover w-full h-full" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs h-9" onClick={() => setIsMediaModalOpen(true)}>
                    تغییر تصویر
                  </Button>
                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 h-9" onClick={() => setThumbnail('')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsMediaModalOpen(true)}
              >
                <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                <span className="text-sm font-medium">انتخاب تصویر شاخص</span>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">تحلیل‌گر سئو (RankMath)</h2>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getScoreBg()} ${getScoreColor()}`}>
                {seoScore}
              </div>
            </div>

            <div className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">دسته‌بندی محتوا</label>
                {isAddingNewCategory ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      autoFocus
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="نام دسته‌بندی جدید..."
                      className="flex-1 h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <button 
                      onClick={async () => {
                        const trimmedCat = category.trim();
                        if (trimmedCat && !categories.includes(trimmedCat) && !localCategories.includes(trimmedCat)) {
                          setLocalCategories([...localCategories, trimmedCat]);
                          // Save it permanently via Server Action so it's available everywhere
                          createCategory(trimmedCat).catch(console.error);
                        }
                        setIsAddingNewCategory(false);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="تایید"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setIsAddingNewCategory(false); setCategory(''); }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                      title="انصراف"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <select 
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setIsAddingNewCategory(true);
                        setCategory('');
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">انتخاب دسته‌بندی...</option>
                    {[...categories, ...localCategories].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new" className="font-bold text-indigo-600">+ افزودن دسته جدید</option>
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">کلمه کلیدی هدف</label>
                <input 
                  type="text" 
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="مثلاً: خرید گوشی سامسونگ" 
                  className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>عنوان سئو (Meta Title)</span>
                  <span className={`text-xs ${metaTitle.length > 60 || metaTitle.length < 40 ? 'text-amber-500' : 'text-green-600'}`}>{metaTitle.length}/60</span>
                </label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>توضیحات متا (Meta Description)</span>
                  <span className={`text-xs ${metaDesc.length > 160 || metaDesc.length < 120 ? 'text-amber-500' : 'text-green-600'}`}>{metaDesc.length}/160</span>
                </label>
                <textarea 
                  rows={4}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm resize-none"
                />
              </div>

              {/* Checklist */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">چک‌لیست سئو:</h3>
                <ul className="space-y-3">
                  {seoChecks.map((check) => (
                    <li key={check.id} className="flex items-start gap-2 text-xs">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className={check.passed ? 'text-slate-600' : 'text-slate-900 font-medium'}>
                        {check.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" className="w-full gap-2 text-sm h-10">
                <RefreshCw className="w-4 h-4" />
                تحلیل مجدد محتوا
              </Button>
            </div>
          </div>
        </div>

      </div>

      <MediaPickerModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setThumbnail(url)}
      />
    </div>
  );
}
