"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMediaFiles } from '@/app/admin/posts/actions';
import { toast } from 'react-hot-toast';


interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: { url: string; alt?: string; title?: string }) => void;
  requireSeo?: boolean;
}

interface MediaFile {
  name: string;
  url: string;
}

export function MediaPickerModal({ isOpen, onClose, onSelect, requireSeo = false }: MediaPickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [altText, setAltText] = useState('');
  const [titleText, setTitleText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await getMediaFiles();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
      setSelectedFile(null);
      setAltText('');
      setTitleText('');
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchFiles(); // Refresh list
      } else {
        toast.error(result.error || 'آپلود ناموفق بود.');
      }
    } catch (error) {
      toast.error('خطای شبکه.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">انتخاب تصویر</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Grid Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 border-l border-slate-100">
            <div className="flex gap-4 mb-6">
              <Button className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'در حال آپلود...' : 'آپلود عکس جدید'}
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                هیچ تصویری در کتابخانه موجود نیست.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {files.map((file) => (
                  <div 
                    key={file.name} 
                    onClick={() => {
                      if (requireSeo) {
                        setSelectedFile(file);
                        setAltText(file.name.split('.')[0]); // Pre-fill with filename
                        setTitleText(file.name.split('.')[0]);
                      } else {
                        onSelect({ url: file.url });
                        onClose();
                      }
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-200 border-2 cursor-pointer transition-all ${
                      selectedFile?.url === file.url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-indigo-400'
                    }`}
                  >
                    <Image 
                      src={file.url} 
                      alt={file.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    {!requireSeo && (
                      <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all drop-shadow-md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Sidebar (Only visible if requireSeo is true AND a file is selected) */}
          {requireSeo && selectedFile && (
            <div className="w-80 bg-white p-6 border-l border-slate-100 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 animate-in slide-in-from-left-8 duration-300">
              <h3 className="font-bold text-slate-800 mb-4">جزئیات تصویر و سئو</h3>
              
              <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-6 border border-slate-200">
                <Image src={selectedFile.url} alt="Preview" fill className="object-contain" unoptimized />
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">متن جایگزین (Alt Text)</label>
                  <input 
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="مثال: گوشی سامسونگ مدل S24"
                  />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    متن جایگزین برای موتورهای جستجو (SEO) و دسترسی‌پذیری بسیار مهم است.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">عنوان تصویر (Title Text)</label>
                  <input 
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="نمایش هنگام هاور کردن موس"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-auto">
                <Button 
                  className="w-full gap-2"
                  onClick={() => {
                    onSelect({ url: selectedFile.url, alt: altText, title: titleText });
                    onClose();
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تایید و درج تصویر
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
