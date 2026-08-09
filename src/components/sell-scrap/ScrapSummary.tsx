import React from 'react';
import { type ScrapItem } from '../../data/scrapItems';

interface ScrapSummaryProps {
  items: ScrapItem[];
  selectedCollectorOffer?: {
    collectorName: string;
    offeredRates: Record<string, number>; // itemId -> offered rate
  } | null;
}

export const ScrapSummary: React.FC<ScrapSummaryProps> = ({ items, selectedCollectorOffer }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs space-y-6 sticky top-20">
      <div className="flex items-center justify-between border-b border-brand-border pb-3">
        <h3 className="font-bold text-brand-text text-base sm:text-lg">Your Scrap Summary</h3>
        <span className="text-xl">♻️</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-brand-border rounded-xl">
          <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
            📦
          </div>
          <p className="text-sm font-semibold text-brand-text">No items detected yet</p>
          <p className="text-xs text-brand-text-secondary mt-1">
            Upload images and click "Detect Items" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrap-scroll">
            {items.map((item) => {
              const offeredRate = selectedCollectorOffer?.offeredRates[item.id] ?? item.price;
              return (
                <div key={item.id} className="flex items-center justify-between bg-brand-bg/60 p-3 rounded-xl border border-brand-border/60 text-xs">
                  <div>
                    <span className="font-bold text-brand-text block text-sm">{item.name}</span>
                    <span className="text-[10px] text-brand-text-secondary">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-primary text-sm">₹{offeredRate}/kg</span>
                    <span className="text-[10px] text-brand-text-secondary block">Weight: To be measured</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Total Box */}
          <div className="bg-brand-light/50 border border-brand-primary/20 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-brand-text-secondary">
              <span>Estimated Total:</span>
              <span className="font-bold text-brand-primary text-sm">Calculated after weighing</span>
            </div>
            <p className="text-[10px] text-brand-text-secondary leading-normal">
              The collector will weigh each item during pickup and the final amount will be calculated using the agreed collector rate.
            </p>
          </div>
        </div>
      )}

      {/* Trust Highlights */}
      <div className="space-y-2.5 pt-2 border-t border-brand-border text-xs text-brand-text-secondary">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-primary">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Best Market Rates</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-primary">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>Zero Pickup Charges</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-primary">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Secure & Trusted Collectors</span>
        </div>
      </div>
    </div>
  );
};
