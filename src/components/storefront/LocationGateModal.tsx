'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/store/CartContext';
import dynamic from 'next/dynamic';

import { toast } from 'react-hot-toast';


const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[250px] bg-slate-100 flex items-center justify-center rounded-xl animate-pulse"><MapPin className="w-8 h-8 text-slate-300" /></div>
});

interface LocationGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet?: (province: string, city: string) => void;
}

export function LocationGateModal({ isOpen, onClose, onLocationSet }: LocationGateModalProps) {
  const { setLocation } = useCart();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [mounted, setMounted] = useState(false);
  const LOCATIONS: Record<string, string[]> = typeof window !== 'undefined' ? (window as any).__LOCATIONS__ || {} : {};

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const filteredProvinces = Object.keys(LOCATIONS).filter(p => p.includes(provinceSearch));
  const availableCities = selectedProvince ? LOCATIONS[selectedProvince] : [];
  const filteredCities = availableCities.filter(c => c.includes(citySearch));

  const normalizeLocationName = (name: string) => {
    if (!name) return '';
    return name
      .replace(/استان\s+/g, '')
      .replace(/شهرستان\s+/g, '')
      .replace(/شهر\s+/g, '')
      .replace(/بخش\s+/g, '')
      .replace(/روستای\s+/g, '')
      .replace(/دهستان\s+/g, '')
      .trim();
  };

  const findClosestMatch = (normalizedStr: string, list: string[]) => {
    if (!normalizedStr) return null;
    const exact = list.find(item => item === normalizedStr);
    if (exact) return exact;
    
    const noSpaceStr = normalizedStr.replace(/\s+/g, '');
    const noSpaceMatch = list.find(item => item.replace(/\s+/g, '') === noSpaceStr);
    if (noSpaceMatch) return noSpaceMatch;
    
    const partialMatch = list.find(item => item.includes(normalizedStr) || normalizedStr.includes(item));
    if (partialMatch) return partialMatch;
    
    return null;
  };

  const handleMapSelect = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
      const data = await res.json();
      
      if (data && data.address) {
        const rawState = data.address.state || '';
        const rawCity = data.address.city || data.address.town || data.address.county || data.address.village || '';
        
        const normalizedState = normalizeLocationName(rawState);
        const normalizedCity = normalizeLocationName(rawCity);
        
        const matchedProvince = findClosestMatch(normalizedState, Object.keys(LOCATIONS));
        
        if (matchedProvince) {
          setSelectedProvince(matchedProvince);
          setProvinceSearch('');
          
          const matchedCity = findClosestMatch(normalizedCity, LOCATIONS[matchedProvince]);
          if (matchedCity) {
            setSelectedCity(matchedCity);
            setCitySearch('');
          } else {
            // Found province but couldn't match city precisely
            setSelectedCity('');
            setCitySearch(normalizedCity); 
          }
        }
      }
    } catch (error) {
      console.error('Failed to geocode location:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalProvince = selectedProvince;
    if (!finalProvince && provinceSearch) {
      const match = findClosestMatch(provinceSearch, Object.keys(LOCATIONS));
      if (match) finalProvince = match;
    }

    let finalCity = selectedCity;
    if (!finalCity && citySearch && finalProvince) {
      const match = findClosestMatch(citySearch, LOCATIONS[finalProvince]);
      if (match) {
        finalCity = match;
      } else {
        finalCity = citySearch;
      }
    }

    if (!finalProvince || !finalCity) {
      toast.error("لطفاً استان و شهر خود را به درستی وارد کنید.");
      return;
    }
    
    setLocation(finalProvince, finalCity);
    if (onLocationSet) onLocationSet(finalProvince, finalCity);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-none md:rounded-3xl w-full max-w-xl h-[100dvh] md:h-auto md:max-h-[90vh] relative z-10 shadow-2xl animate-in fade-in slide-in-from-bottom md:zoom-in-95 duration-300 flex flex-col overflow-hidden pb-4 md:pb-0">
        
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex items-center justify-center pt-3 pb-1 bg-emerald-600">
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[500]">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white relative z-10">انتخاب موقعیت مکانی</h3>
          <p className="text-emerald-100 mt-1 relative z-10 text-xs">
            برای مشاهده نمایندگی‌ها و بررسی موجودی
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-visible p-6 flex flex-col gap-4">
          
          <form id="location-form" onSubmit={handleSubmit} className="space-y-5 relative z-[1000]">
            <div className="relative z-20">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">استان خود را انتخاب کنید</label>
              <input
                type="text"
                required
                value={selectedProvince ? selectedProvince : provinceSearch}
                onChange={e => {
                  setProvinceSearch(e.target.value);
                  setSelectedProvince('');
                  setSelectedCity('');
                  setCitySearch('');
                  setIsProvinceDropdownOpen(true);
                }}
                onFocus={() => setIsProvinceDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsProvinceDropdownOpen(false), 200)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all bg-slate-50 text-slate-700 cursor-pointer"
                placeholder="جستجوی استان..."
              />
              {isProvinceDropdownOpen && filteredProvinces.length > 0 && (
                <ul className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl shadow-inner max-h-48 overflow-y-auto py-1 absolute z-50">
                  {filteredProvinces.map(p => (
                    <li 
                      key={p} 
                      onClick={() => {
                        setSelectedProvince(p);
                        setProvinceSearch('');
                        setIsProvinceDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm text-slate-700"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="relative z-10">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">شهر خود را وارد کنید</label>
              <input
                type="text"
                required
                disabled={!selectedProvince}
                value={selectedCity ? selectedCity : citySearch}
                onChange={e => {
                  setCitySearch(e.target.value);
                  setSelectedCity('');
                  setIsCityDropdownOpen(true);
                }}
                onFocus={() => setIsCityDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsCityDropdownOpen(false), 200)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all bg-slate-50 text-slate-700 disabled:opacity-50 cursor-pointer"
                placeholder={selectedProvince ? "جستجوی شهر..." : "ابتدا استان را انتخاب کنید"}
              />
              {isCityDropdownOpen && selectedProvince && filteredCities.length > 0 && (
                <ul className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl shadow-inner max-h-48 overflow-y-auto py-1 absolute z-50">
                  {filteredCities.map(c => (
                    <li 
                      key={c} 
                      onClick={() => {
                        setSelectedCity(c);
                        setCitySearch('');
                        setIsCityDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm text-slate-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>

          {/* Map Section */}
          <div className="w-full flex-1 min-h-[200px] relative z-0 flex items-center justify-center border border-slate-200 rounded-xl overflow-hidden shadow-inner shrink-0">
            {isGeocoding && (
              <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-700 animate-in fade-in">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="font-medium text-sm">در حال تشخیص موقعیت...</p>
              </div>
            )}
            <MapPicker onLocationSelect={handleMapSelect} />
          </div>
        </div>
        
        {/* Action Buttons (Fixed at bottom) */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-white shrink-0 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 text-base border-slate-200 text-slate-600 hover:bg-slate-100">
            انصراف
          </Button>
          <Button type="submit" form="location-form" className="flex-[2] h-12 text-base gap-2 bg-emerald-600 hover:bg-emerald-700">
            ثبت موقعیت
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
