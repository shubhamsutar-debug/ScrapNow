import React from 'react';

export const AIBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#E6F7ED] via-brand-light to-[#D1F3DD] border border-brand-primary/20 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Soft Background Eco Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start sm:items-center gap-3.5 relative z-10">
        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-brand-primary/20 flex-shrink-0">
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-brand-text text-base sm:text-lg">
              AI Detection Powered by OpenRouter AI
            </h3>
            <span className="px-2.5 py-0.5 bg-brand-primary text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-xs">
              FREE
            </span>
          </div>
          <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
            We use advanced AI to identify your scrap items and give you the best estimated price.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-brand-primary border border-white/90 shadow-2xs whitespace-nowrap">
        <span>Fast • Accurate • Free</span>
      </div>
    </div>
  );
};
