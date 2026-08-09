import React, { useState } from 'react';
import { type ScrapItem } from '../../data/scrapItems';
import { CollectorMap, type CollectorData } from './CollectorMap';

export const sampleCollectors: CollectorData[] = [
  {
    id: 'c1',
    name: 'GreenCycle Scrap Solutions',
    avatar: '🟢',
    rating: 4.8,
    reviewsCount: 142,
    distanceKm: 1.2,
    address: 'Kothrud, Pune',
    materialsAccepted: ['Paper', 'Plastic', 'Metal', 'E-Waste'],
    offeredRates: {
      newspaper: 26,       // Market: 25
      cardboard: 11,       // Market: 10
      'plastic-bottles': 27, // Market: 26
      iron: 32,            // Market: 30
      aluminium: 125,      // Market: 120
      copper: 630,         // Market: 620
    },
    pickupFee: 0,
  },
  {
    id: 'c2',
    name: 'EcoRecycle Traders',
    avatar: '🌱',
    rating: 4.6,
    reviewsCount: 98,
    distanceKm: 2.5,
    address: 'Viman Nagar, Pune',
    materialsAccepted: ['Paper', 'Plastic', 'Metal'],
    offeredRates: {
      newspaper: 24,
      cardboard: 10,
      'plastic-bottles': 26,
      iron: 30,
      aluminium: 120,
      copper: 620,
    },
    pickupFee: 0,
  },
  {
    id: 'c3',
    name: 'Swachh Scrap Mart',
    avatar: '♻️',
    rating: 4.9,
    reviewsCount: 215,
    distanceKm: 3.8,
    address: 'Hadapsar, Pune',
    materialsAccepted: ['Paper', 'Metal', 'E-Waste'],
    offeredRates: {
      newspaper: 25,
      cardboard: 10.5,
      'plastic-bottles': 25.5,
      iron: 31,
      aluminium: 122,
      copper: 625,
    },
    pickupFee: 0,
  },
];

interface CollectorSelectionProps {
  detectedItems: ScrapItem[];
  selectedCollector: CollectorData | null;
  onSelectCollector: (collector: CollectorData) => void;
  onProceedToPickup: () => void;
}

export const CollectorSelection: React.FC<CollectorSelectionProps> = ({
  detectedItems,
  selectedCollector,
  onSelectCollector,
  onProceedToPickup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollectors = sampleCollectors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-brand-text text-lg">Choose a Collector</h3>
            <span className="px-2.5 py-0.5 bg-brand-light text-brand-dark rounded-full text-xs font-bold border border-brand-primary/20">
              Verified Nearby
            </span>
          </div>
          <p className="text-brand-text-secondary text-xs sm:text-sm ml-8 mt-0.5">
            Compare offered prices and select your preferred collector with free home pickup
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search Pune location/collector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg text-brand-text focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Interactive Map View */}
      <CollectorMap
        collectors={filteredCollectors}
        selectedCollectorId={selectedCollector?.id}
        onSelectCollector={onSelectCollector}
      />

      {/* Collector Cards List / No Collector Available Fallback */}
      {filteredCollectors.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-brand-border rounded-2xl bg-brand-bg/50">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-sm">
            📍
          </div>
          <h4 className="font-bold text-brand-text text-base">No collector available in your location</h4>
          <p className="text-brand-text-secondary text-xs mt-1 max-w-sm mx-auto">
            Please check the map or visit a nearby ScrapNow collector store in central Pune.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCollectors.map((c) => {
            const isSelected = selectedCollector?.id === c.id;

            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-primary bg-brand-light/30 shadow-md ring-2 ring-brand-primary/20'
                    : 'border-brand-border bg-brand-card hover:border-brand-primary/50 shadow-2xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Collector Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xl shadow-2xs font-bold">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-brand-text text-base">{c.name}</h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                            ₹0 Pickup Charge
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-brand-text-secondary mt-0.5">
                          <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                            ⭐ {c.rating} <span className="text-brand-text-secondary font-normal">({c.reviewsCount})</span>
                          </span>
                          <span>• {c.distanceKm} km away</span>
                          <span>• {c.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rates Comparison Matrix for Detected Items */}
                    {detectedItems.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {detectedItems.map((item) => {
                          const offeredRate = c.offeredRates[item.id] ?? item.price;
                          const isHigher = offeredRate > item.price;

                          return (
                            <div key={item.id} className="bg-white px-2.5 py-1 rounded-lg border border-brand-border/80 text-xs flex items-center gap-1.5 shadow-2xs">
                              <span className="text-brand-text-secondary font-medium">{item.name}:</span>
                              <span className={`font-bold ${isHigher ? 'text-emerald-600' : 'text-brand-text'}`}>
                                ₹{offeredRate}/kg
                              </span>
                              {isHigher && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                                  +₹{offeredRate - item.price}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right: Select Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-brand-border">
                    <button
                      onClick={() => onSelectCollector(c)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer ${
                        isSelected
                          ? 'bg-brand-primary text-white hover:bg-brand-dark ring-2 ring-brand-primary/30'
                          : 'bg-brand-bg text-brand-text border border-brand-border hover:border-brand-primary hover:bg-brand-light'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select Collector'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onProceedToPickup}
          disabled={!selectedCollector}
          className="py-3.5 px-8 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group cursor-pointer"
        >
          <span>Schedule Pickup</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
};
