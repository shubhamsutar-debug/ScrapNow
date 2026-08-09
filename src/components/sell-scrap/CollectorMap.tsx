import React from 'react';

export interface CollectorData {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  materialsAccepted: string[];
  offeredRates: Record<string, number>; // itemId -> rate
  pickupFee: number; // 0
}

interface CollectorMapProps {
  collectors: CollectorData[];
  selectedCollectorId?: string;
  onSelectCollector: (collector: CollectorData) => void;
}

export const CollectorMap: React.FC<CollectorMapProps> = ({
  collectors,
  selectedCollectorId,
  onSelectCollector,
}) => {
  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-brand-border bg-[#E5ECE7] shadow-inner group">
      {/* Mock Map Background Canvas Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C2D6C8" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* River curve */}
        <path d="M 0 100 Q 150 180 300 120 T 600 200" fill="none" stroke="#93C5FD" strokeWidth="14" opacity="0.7" />
        {/* Main roads */}
        <line x1="50" y1="0" x2="450" y2="300" stroke="#FDE68A" strokeWidth="8" />
        <line x1="0" y1="180" x2="500" y2="40" stroke="#FFFFFF" strokeWidth="6" />
        <circle cx="240" cy="140" r="45" fill="#D1FAE5" opacity="0.6" />
      </svg>

      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-xs text-xs font-bold text-brand-text flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Pune, Maharashtra (Nearby Collectors)</span>
      </div>

      {/* Pins for collectors */}
      {collectors.map((c, i) => {
        const positions = [
          { top: '35%', left: '30%' },
          { top: '55%', left: '60%' },
          { top: '25%', left: '75%' },
        ];
        const pos = positions[i % positions.length];
        const isSelected = c.id === selectedCollectorId;

        return (
          <div
            key={c.id}
            onClick={() => onSelectCollector(c)}
            style={{ top: pos.top, left: pos.left }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group/pin z-10 ${
              isSelected ? 'scale-125 z-20' : 'hover:scale-110'
            }`}
          >
            <div className={`flex flex-col items-center`}>
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-dark'
                    : 'bg-white text-brand-text border-brand-border group-hover/pin:border-brand-primary'
                }`}
              >
                <span>⭐ {c.rating}</span>
                <span>• {c.name.split(' ')[0]}</span>
              </div>
              <div
                className={`w-3 h-3 rounded-full rotate-45 -mt-1.5 shadow-xs ${
                  isSelected ? 'bg-brand-primary' : 'bg-white'
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
