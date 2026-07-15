"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
          <h1 className="text-2xl font-bold text-slate-900">نوشتن مطلب جدید</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">پیش‌نویس</Button>
          <Button className="gap-2">
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

        {/* SEO Optimizer Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">تحلیل‌گر سئو (RankMath)</h2>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getScoreBg()} ${getScoreColor()}`}>
                {seoScore}
              </div>
            </div>

            <div className="space-y-5">
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
    </div>
  );
}
