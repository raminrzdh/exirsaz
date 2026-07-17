"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, FileImage, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteMediaFile } from '@/app/admin/posts/actions';

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  date: Date;
}

export function MediaLibraryClient({ initialFiles }: { initialFiles: MediaFile[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
        // Refresh the page to show the new file in the grid
        router.refresh();
      } else {
        alert(result.error || 'آپلود ناموفق بود.');
      }
    } catch (error) {
      alert('خطای شبکه در هنگام آپلود.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(`آیا از حذف تصویر "${filename}" مطمئن هستید؟ این عمل غیرقابل بازگشت است.`)) {
      return;
    }

    setIsUploading(true); // Using this to show a loading state
    try {
      const result = await deleteMediaFile(filename);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'خطا در حذف فایل.');
      }
    } catch (error) {
      alert('خطای شبکه.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      
      {/* Upload Zone */}
      <div 
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-500 mb-4">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 mb-1">
          {isUploading ? 'در حال آپلود...' : 'برای آپلود فایل کلیک کنید'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          فرمت‌های مجاز: JPG, PNG, GIF, WebP. حداکثر حجم: ۵ مگابایت.
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>

      {/* Grid */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
          فایل‌های آپلود شده ({initialFiles.length})
        </h3>
        
        {initialFiles.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileImage className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>هیچ فایلی تاکنون آپلود نشده است.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {initialFiles.map((file) => (
              <div key={file.name} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
                <div className="aspect-square relative flex-shrink-0 bg-slate-100">
                  <Image 
                    src={file.url} 
                    alt={file.name} 
                    fill 
                    className="object-cover"
                    unoptimized // For local uploaded files without external host config
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(file.url)}
                      className="p-2 bg-white rounded-lg text-slate-700 hover:text-indigo-600 transition-colors tooltip"
                      title="کپی آدرس"
                    >
                      {copiedUrl === file.url ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Upload className="w-4 h-4 rotate-90" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteFile(file.name)}
                      className="p-2 bg-white rounded-lg text-slate-700 hover:text-red-600 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2 text-xs truncate border-t border-slate-100" title={file.name}>
                  <div className="font-medium text-slate-800 truncate mb-0.5">{file.name}</div>
                  <div className="text-slate-500 flex justify-between">
                    <span>{formatSize(file.size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
