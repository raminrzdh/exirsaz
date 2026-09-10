'use client';

import { useState } from 'react';
import { PhoneCall, MessageCircle, MapPin, FileText } from 'lucide-react';
import { InquiryLeadModal } from './InquiryLeadModal';
import { trackEvent } from '@/lib/utils/analytics';
import { recordLeadEvent } from '@/app/(storefront)/products/actions';

interface Agency {
  id: string;
  name: string;
  phone?: string | null;
  mobile?: string | null;
  hasWhatsapp: boolean;
  whatsappNumber?: string | null;
  hasBale: boolean;
  baleNumber?: string | null;
  hasPhoneCall: boolean;
  phoneCallNumber?: string | null;
  hasRequestForm: boolean;
  locationCoordinates?: string | null;
}

export function AgencyContactButtonsClient({ agency }: { agency: Agency }) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const handleContact = (type: 'CALL' | 'WHATSAPP' | 'BALE' | 'NAVIGATION') => {
    // Fire and forget analytics event
    recordLeadEvent(agency.id, type).catch(console.error);
    trackEvent('contact_agent_clicked', { agencyId: agency.id, type });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {agency.hasPhoneCall && (agency.phoneCallNumber || agency.phone || agency.mobile) && (
          <a 
            href={`tel:${agency.phoneCallNumber || agency.phone || agency.mobile}`} 
            onClick={() => handleContact('CALL')}
            className="flex items-center justify-center gap-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            تماس تلفنی
          </a>
        )}
        {agency.hasWhatsapp && (agency.whatsappNumber || agency.mobile) && (
          <a 
            href={`https://wa.me/${(agency.whatsappNumber || agency.mobile)!.startsWith('0') ? '98' + (agency.whatsappNumber || agency.mobile)!.substring(1) : (agency.whatsappNumber || agency.mobile)}?text=${encodeURIComponent(`سلام، از طریق سایت اکسیرساز پیام می‌دهم.`)}`} 
            target="_blank" rel="noreferrer"
            onClick={() => handleContact('WHATSAPP')}
            className="flex items-center justify-center gap-2 w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            واتس‌اپ
          </a>
        )}
        {agency.hasBale && (agency.baleNumber || agency.mobile) && (
          <a 
            href={`https://ble.ir/${agency.baleNumber || agency.mobile}`} 
            target="_blank" rel="noreferrer"
            onClick={() => handleContact('BALE')}
            className="flex items-center justify-center gap-2 w-full h-11 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            پیام‌رسان بله
          </a>
        )}
        {agency.hasRequestForm && (
          <button 
            onClick={() => setIsInquiryModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            ثبت درخواست
          </button>
        )}
        {agency.locationCoordinates && (
          <a 
            href={`https://nshn.ir/?lat=${agency.locationCoordinates.split(',')[0]}&lng=${agency.locationCoordinates.split(',')[1]}`} 
            target="_blank" rel="noreferrer"
            onClick={() => handleContact('NAVIGATION')}
            className="flex items-center justify-center gap-2 w-full h-11 border-2 border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 rounded-xl font-medium transition-colors"
          >
            <MapPin className="w-4 h-4" />
            مسیریابی با نشان
          </a>
        )}
      </div>

      <InquiryLeadModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        productName="استعلام کلی از نمایندگی"
        agencyId={agency.id}
      />
    </>
  );
}
