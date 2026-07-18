'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';


// Custom Text Badge Icon
const CustomBadgeIcon = L.divIcon({
  className: 'custom-badge-icon',
  html: `<div style="background-color: #059669; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transform: translate(-50%, -50%); border: 2px solid white; position: absolute; left: 0; top: 0; font-family: var(--font-vazirmatn), Vazirmatn, Tahoma, sans-serif !important; display: flex; align-items: center; justify-content: center;">📍 شهر تحویل سفارش</div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationClick({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocateControl({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    map.locate().on("locationfound", function (e) {
      setIsLocating(false);
      map.flyTo(e.latlng, 14);
      onSelect(e.latlng.lat, e.latlng.lng);
    }).on("locationerror", function (e) {
      setIsLocating(false);
      toast.error("دسترسی به موقعیت مکانی امکان‌پذیر نیست. لطفاً دسترسی GPS را باز کنید.");
    });
  };

  return (
    <div className="absolute bottom-4 right-4 z-[400]">
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLocate();
        }}
        className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center"
        title="موقعیت من"
      >
        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-xl overflow-hidden border border-slate-200">
      <MapContainer 
        center={[32.4279, 53.6880]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', minHeight: '350px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationClick onSelect={handleSelect} />
        <LocateControl onSelect={handleSelect} />
        {position && (
          <Marker position={position} icon={CustomBadgeIcon} />
        )}
      </MapContainer>
      
      {!position && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[400] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-slate-700 animate-bounce">
            برای انتخاب مکان، روی نقشه کلیک کنید
          </div>
        </div>
      )}
    </div>
  );
}
