'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateGeneralSettings } from './actions';
import { Save, Image as ImageIcon } from 'lucide-react';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import Image from 'next/image';

export default function GeneralSettingsClient({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    siteName: initialData?.siteName || '',
    siteDescription: initialData?.siteDescription || '',
    logoUrl: initialData?.logoUrl || '',
    faviconUrl: initialData?.faviconUrl || '',
    supportPhone: initialData?.supportPhone || '',
    supportEmail: initialData?.supportEmail || '',
    whatsappNumber: initialData?.whatsappNumber || '',
    customHeaderScripts: initialData?.customHeaderScripts || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<'logoUrl' | 'faviconUrl' | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (field: 'logoUrl' | 'faviconUrl') => {
    setActiveMediaField(field);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (data: { url: string }) => {
    if (activeMediaField) {
      handleChange(activeMediaField, data.url);
    }
    setMediaPickerOpen(false);
  };

  const handleSave = async () => {
    if (!formData.siteName) {
      toast.error('نام سایت الزامی است');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await updateGeneralSettings(formData);

      if (res?.success) {
        toast.success('تنظیمات با موفقیت ذخیره شد');
        // Force reload to bypass cache and update global layout immediately
        window.location.reload();
      } else {
        setIsSaving(false);
        toast.error('خطا در ذخیره تنظیمات');
      }
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      toast.error('خطا در ارتباط با سرور');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه فروشگاه</CardTitle>
          <CardDescription>اطلاعات عمومی فروشگاه که در سئو و بخش‌های مختلف نمایش داده می‌شود.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام سایت *</label>
              <Input 
                value={formData.siteName} 
                onChange={(e) => handleChange('siteName', e.target.value)} 
                placeholder="مثلا: اکسیرساز" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">توضیحات پیش‌فرض سایت (SEO Description)</label>
              <Textarea 
                value={formData.siteDescription} 
                onChange={(e) => handleChange('siteDescription', e.target.value)} 
                placeholder="توضیحات متای سایت که در گوگل نمایش داده می‌شود..." 
                rows={1}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">لوگو فروشگاه</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shrink-0">
                  {formData.logoUrl ? (
                    <Image src={formData.logoUrl} alt="Logo" fill className="object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Input value={formData.logoUrl} readOnly placeholder="انتخاب از رسانه..." dir="ltr" className="text-sm" />
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => openMediaPicker('logoUrl')}>انتخاب تصویر</Button>
                    {formData.logoUrl && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleChange('logoUrl', '')} className="text-red-500">حذف</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">فاوآیکون (Favicon)</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shrink-0">
                  {formData.faviconUrl ? (
                    <Image src={formData.faviconUrl} alt="Favicon" fill className="object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Input value={formData.faviconUrl} readOnly placeholder="انتخاب از رسانه..." dir="ltr" className="text-sm" />
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => openMediaPicker('faviconUrl')}>انتخاب تصویر</Button>
                    {formData.faviconUrl && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleChange('faviconUrl', '')} className="text-red-500">حذف</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">شماره تماس پشتیبانی</label>
              <Input 
                value={formData.supportPhone} 
                onChange={(e) => handleChange('supportPhone', e.target.value)} 
                placeholder="021-12345678" 
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">شماره واتس‌اپ</label>
              <Input 
                value={formData.whatsappNumber} 
                onChange={(e) => handleChange('whatsappNumber', e.target.value)} 
                placeholder="09121234567" 
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ایمیل پشتیبانی</label>
              <Input 
                value={formData.supportEmail} 
                onChange={(e) => handleChange('supportEmail', e.target.value)} 
                placeholder="info@exirsaz.com" 
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>کدهای اختصاصی (Scripts)</CardTitle>
          <CardDescription>
            کدهای جاوااسکریپت و تگ‌های HTML سفارشی (مانند Google Tag Manager، ابزارهای چت و Analytics) را اینجا قرار دهید. این کدها در تمام صفحات سایت در بخش `{"<head>"}` لود خواهند شد.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
              کدهای Header
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">احتیاط: کدهای مخرب ممکن است سایت را دچار مشکل کنند</span>
            </label>
            <Textarea 
              value={formData.customHeaderScripts} 
              onChange={(e) => handleChange('customHeaderScripts', e.target.value)} 
              placeholder="<!-- Google Tag Manager -->\n<script>...</script>" 
              className="font-mono text-sm bg-slate-50 min-h-[200px]"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-6 z-10">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg px-8">
          <Save className="w-4 h-4" />
          {isSaving ? 'در حال ذخیره و بارگذاری مجدد...' : 'ذخیره تنظیمات'}
        </Button>
      </div>

      <MediaPickerModal 
        isOpen={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        onSelect={handleMediaSelect} 
      />
    </div>
  );
}
