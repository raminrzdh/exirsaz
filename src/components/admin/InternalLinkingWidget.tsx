'use client';

import { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink } from 'lucide-react';

interface Suggestion {
  text: string;
  url: string;
  type: 'product' | 'post';
}

interface InternalLinkingWidgetProps {
  content: string;
}

export function InternalLinkingWidget({ content }: InternalLinkingWidgetProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Debounce the API call
    const timer = setTimeout(async () => {
      if (!content || content.trim().length < 10) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/seo/internal-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Failed to fetch link suggestions', error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [content]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-indigo-500" />
          لینک‌سازی داخلی
        </h2>
        {isLoading && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          هوش مصنوعی عبارات موجود در متن را با محصولات و مقالات سایت تطبیق می‌دهد تا بتوانید به راحتی لینک‌سازی داخلی انجام دهید.
        </p>
        
        {!isLoading && suggestions.length === 0 && (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">عبارتی برای لینک‌سازی یافت نشد.</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {suggestions.map((s, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold text-sm text-slate-800">
                    "{s.text}"
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${s.type === 'product' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                    {s.type === 'product' ? 'محصول' : 'مقاله'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleCopy(s.url)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                  >
                    {copiedUrl === s.url ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl === s.url ? 'کپی شد' : 'کپی لینک'}
                  </button>
                  <a 
                    href={s.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-lg hover:text-indigo-600 transition-colors"
                    title="مشاهده صفحه"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
