import React from 'react';
import { type ScrapItem } from '../../data/scrapItems';

interface DetectedItem extends ScrapItem {
  detectedConfidence?: number;
}

interface AIDetectionProps {
  detectedItems: DetectedItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  onProceedToQuotes: () => void;
}

export const AIDetection: React.FC<AIDetectionProps> = ({
  detectedItems,
  onRemoveItem,
  onAddItem,
  onProceedToQuotes,
}) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-brand-text text-lg">AI Detected Items</h3>
            <span className="px-2.5 py-0.5 bg-brand-light text-brand-dark rounded-full text-xs font-bold border border-brand-primary/20">
              {detectedItems.length} Material{detectedItems.length !== 1 ? 's' : ''} Identified
            </span>
          </div>
          <p className="text-brand-text-secondary text-xs sm:text-sm ml-8 mt-0.5">
            OpenRouter AI identified the following recyclable materials from your images:
          </p>
        </div>

        <button
          onClick={onAddItem}
          className="px-4 py-2 bg-brand-bg hover:bg-brand-light border border-brand-border hover:border-brand-primary text-brand-primary font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Add Another Scrap Item</span>
        </button>
      </div>

      {/* Weight Clarification Banner (CRITICAL ScrapNow LOGIC REQUIREMENT) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
        <span className="text-xl">⚖️</span>
        <div>
          <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
            Physical Weight Notice
          </h4>
          <p className="text-emerald-800/90 text-xs mt-0.5 leading-relaxed">
            Final weight will be measured by the selected collector using a physical weighing machine during pickup.
          </p>
        </div>
      </div>

      {/* Detected Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {detectedItems.map((item) => (
          <div
            key={item.id}
            className="bg-brand-bg/50 border border-brand-border hover:border-brand-primary/60 rounded-xl p-4 transition-all duration-200 shadow-2xs relative group flex flex-col justify-between"
          >
            {/* Delete button */}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="absolute top-3 right-3 text-brand-text-secondary hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
              title="Remove item"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-start gap-3">
              {/* Item Image */}
              <div className="w-16 h-16 rounded-lg bg-white border border-brand-border p-1.5 flex items-center justify-center flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>

              <div>
                <span className="px-2 py-0.5 bg-brand-light text-brand-dark text-[10px] font-bold rounded-full">
                  {item.category}
                </span>
                <h4 className="font-bold text-brand-text text-base mt-1">{item.name}</h4>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-brand-primary font-extrabold text-lg">₹{item.price}</span>
                  <span className="text-xs text-brand-text-secondary">/{item.unit} (Market Rate)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-text-secondary">
              <span>Weight:</span>
              <span className="font-semibold text-brand-text bg-white px-2 py-0.5 rounded border border-brand-border">
                To be measured
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action CTA */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onProceedToQuotes}
          disabled={detectedItems.length === 0}
          className="py-3.5 px-8 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group cursor-pointer"
        >
          <span>Get Collector Quotes</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
};
