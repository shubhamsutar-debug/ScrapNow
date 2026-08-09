import React, { useState } from 'react';
import { type ScrapItem } from '../../data/scrapItems';
import { type CollectorData } from './CollectorMap';

interface WeightItemEntry {
  item: ScrapItem;
  collectorRate: number;
  weightKg: number;
}

interface CollectorWeightEntryProps {
  collector: CollectorData;
  items: ScrapItem[];
  onSubmitWeights: (finalItems: WeightItemEntry[], totalAmount: number) => void;
}

export const CollectorWeightEntry: React.FC<CollectorWeightEntryProps> = ({
  collector,
  items,
  onSubmitWeights,
}) => {
  // Initial default physical weights (can be modified by collector input)
  const [weightEntries, setWeightEntries] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    items.forEach((item) => {
      if (item.id === 'newspaper') initial[item.id] = 8.5;
      else if (item.id === 'plastic-bottles') initial[item.id] = 3.2;
      else if (item.id === 'aluminium') initial[item.id] = 1.5;
      else if (item.id === 'cardboard') initial[item.id] = 5.0;
      else if (item.id === 'iron') initial[item.id] = 10.0;
      else if (item.id === 'copper') initial[item.id] = 0.8;
      else initial[item.id] = 2.0;
    });
    return initial;
  });

  const handleWeightChange = (itemId: string, val: string) => {
    const num = parseFloat(val);
    setWeightEntries((prev) => ({
      ...prev,
      [itemId]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const calculatedItems: WeightItemEntry[] = items.map((item) => {
    const rate = collector.offeredRates[item.id] ?? item.price;
    const weight = weightEntries[item.id] || 0;
    return {
      item,
      collectorRate: rate,
      weightKg: weight,
    };
  });

  const totalFinalAmount = calculatedItems.reduce(
    (acc, curr) => acc + curr.collectorRate * curr.weightKg,
    0
  );

  const handleSubmit = () => {
    onSubmitWeights(calculatedItems, totalFinalAmount);
  };

  return (
    <div className="bg-brand-card border-2 border-brand-primary/30 rounded-2xl p-6 shadow-md space-y-6 animate-[fadeIn_300ms_ease-out]">
      
      {/* Demo Collector Simulator Header Badge */}
      <div className="flex items-center justify-between bg-emerald-950 text-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-xl font-bold">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">Collector Physical Weighing Machine</h3>
              <span className="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-extrabold rounded uppercase">
                Demo Simulator
              </span>
            </div>
            <p className="text-emerald-300 text-xs mt-0.5">
              Collector: {collector.name} (Physical Inspection & Weight Measurement)
            </p>
          </div>
        </div>
      </div>

      <p className="text-brand-text-secondary text-xs sm:text-sm">
        Enter the actual physical weight measured on scale for each item to calculate the final scrap payment:
      </p>

      {/* Item Weights Input Form */}
      <div className="space-y-3">
        {calculatedItems.map(({ item, collectorRate, weightKg }) => {
          const subtotal = collectorRate * weightKg;

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-brand-border bg-brand-bg/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded-lg border border-brand-border p-1" />
                <div>
                  <h4 className="font-bold text-brand-text text-sm">{item.name}</h4>
                  <span className="text-xs text-brand-primary font-semibold">
                    Collector Rate: ₹{collectorRate}/kg
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                {/* Weight Input */}
                <div className="flex items-center gap-1.5">
                  <label htmlFor={`weight-${item.id}`} className="text-xs font-semibold text-brand-text-secondary whitespace-nowrap">
                    Actual Weight:
                  </label>
                  <div className="relative w-28">
                    <input
                      id={`weight-${item.id}`}
                      type="number"
                      step="0.1"
                      min="0"
                      value={weightEntries[item.id] ?? ''}
                      onChange={(e) => handleWeightChange(item.id, e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-sm font-bold text-brand-text border-2 border-brand-primary/40 rounded-xl focus:outline-none focus:border-brand-primary bg-white text-right"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-text-secondary">
                      kg
                    </span>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] text-brand-text-secondary block">Amount</span>
                  <span className="font-extrabold text-brand-primary text-base">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Amount Box */}
      <div className="bg-brand-light/60 border border-brand-primary/30 rounded-xl p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
            Final Calculated Amount
          </span>
          <span className="text-xs text-brand-text-secondary">
            Based on actual physical weights × collector rates
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
            ₹{totalFinalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          className="py-3.5 px-8 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <span>Submit Weights & Generate Bill</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

    </div>
  );
};
