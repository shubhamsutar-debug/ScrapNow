import React, { useState } from 'react';
import { type ScrapItem } from '../../data/scrapItems';
import { type CollectorData } from './CollectorMap';

interface PickupConfirmationProps {
  collector: CollectorData;
  items: ScrapItem[];
  userName: string;
  userPhone: string;
  onConfirmPickup: (details: { address: string; timeSlot: string }) => void;
}

export const PickupConfirmation: React.FC<PickupConfirmationProps> = ({
  collector,
  items,
  userName,
  userPhone,
  onConfirmPickup,
}) => {
  const [address, setAddress] = useState('Flat 402, Green Acres, Paud Road, Kothrud, Pune, Maharashtra - 411038');
  const [timeSlot, setTimeSlot] = useState('Today (2:00 PM - 5:00 PM)');

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-brand-text text-lg">Schedule Pickup Details</h3>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
            ₹0 Pickup Charges
          </span>
        </div>
        <p className="text-brand-text-secondary text-xs sm:text-sm ml-8 mt-0.5">
          Confirm your address and preferred time slot for physical weighing & pickup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Collector & Schedule inputs */}
        <div className="space-y-4">
          {/* Selected Collector Summary */}
          <div className="bg-brand-light/40 border border-brand-primary/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-primary uppercase">Selected Collector</span>
              <span className="text-xs font-semibold text-amber-600">⭐ {collector.rating}</span>
            </div>
            <h4 className="font-bold text-brand-text text-base">{collector.name}</h4>
            <p className="text-xs text-brand-text-secondary">{collector.address} ({collector.distanceKm} km away)</p>
          </div>

          {/* User Address Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
              Pickup Address in Pune
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-brand-border bg-brand-card text-brand-text focus:outline-none focus:border-brand-primary transition"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
              Select Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-brand-border bg-brand-card text-brand-text focus:outline-none focus:border-brand-primary transition"
            >
              <option>Today (2:00 PM - 5:00 PM)</option>
              <option>Today (5:00 PM - 8:00 PM)</option>
              <option>Tomorrow (9:00 AM - 12:00 PM)</option>
              <option>Tomorrow (2:00 PM - 5:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Order Summary & Rates */}
        <div className="bg-brand-bg/60 border border-brand-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-brand-text text-sm mb-3">Scrap & Agreed Collector Rates</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrap-scroll">
              {items.map((item) => {
                const offeredRate = collector.offeredRates[item.id] ?? item.price;
                return (
                  <div key={item.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-brand-border/60 text-xs">
                    <span className="font-semibold text-brand-text">{item.name}</span>
                    <span className="font-extrabold text-brand-primary">₹{offeredRate}/kg</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-brand-border pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-brand-text-secondary">
              <span>Customer:</span>
              <span className="font-semibold text-brand-text">{userName} ({userPhone})</span>
            </div>
            <div className="flex justify-between text-brand-text-secondary">
              <span>Pickup Charges:</span>
              <span className="font-bold text-emerald-600">FREE (₹0)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => onConfirmPickup({ address, timeSlot })}
          disabled={!address.trim()}
          className="py-3.5 px-8 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
        >
          <span>Confirm Pickup & Weighing</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
};
