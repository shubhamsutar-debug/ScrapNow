import React, { useState, useRef } from 'react';
import heroImage from '../../assets/images/hero-recycling.jpg';

interface ScrapUploaderProps {
  onImagesSelected: (files: File[]) => void;
  onDetectItems: () => void;
  isAnalyzing: boolean;
  uploadedImages: string[];
}

export const ScrapUploader: React.FC<ScrapUploaderProps> = ({
  onImagesSelected,
  onDetectItems,
  isAnalyzing,
  uploadedImages,
}) => {
  const [_isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImagesSelected(Array.from(e.target.files));
    }
  };

  const handleCameraTrigger = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    } else {
      setIsCameraActive(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Upload Box + Tips */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-brand-text text-lg">Add Scrap Images</h3>
            </div>
            <p className="text-brand-text-secondary text-xs sm:text-sm ml-8 mb-4">
              Upload clear images of your scrap items
            </p>

            {/* Drag & Drop / Photo Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-brand-primary/40 hover:border-brand-primary bg-brand-bg/60 hover:bg-brand-light/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-3 text-brand-primary group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              <p className="text-sm font-semibold text-brand-text">
                Click a photo or upload from gallery
              </p>
              <p className="text-xs text-brand-text-secondary mt-1">
                Supports JPG, PNG, WEBP (Multiple items supported)
              </p>

              {/* Upload Buttons */}
              <div className="flex items-center justify-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleCameraTrigger}
                  className="px-4 py-2 bg-brand-card border border-brand-border hover:border-brand-primary text-brand-text font-medium text-xs rounded-xl shadow-2xs hover:bg-brand-bg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📷 Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-brand-card border border-brand-border hover:border-brand-primary text-brand-text font-medium text-xs rounded-xl shadow-2xs hover:bg-brand-bg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🖼 Choose Gallery</span>
                </button>
              </div>
            </div>

            {/* Hidden inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Tips Card */}
          <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5">
              <span>💡</span> Tips for better detection
            </div>
            <ul className="space-y-1 text-amber-800/90 font-medium pl-1">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Use clear photos
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Good lighting
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Items should be visible
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Live Camera / Photo Preview Box */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-brand-text text-base">Live Camera Preview</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Viewfinder Preview Box */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border-2 border-brand-border shadow-inner group">
            <img
              src={uploadedImages.length > 0 ? uploadedImages[uploadedImages.length - 1] : heroImage}
              alt="Scrap item camera preview"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Target Viewfinder Overlay Lines */}
            <div className="absolute inset-4 border-2 border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
              </div>
            </div>

            {/* Scanning Laser Animation Line */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-1 bg-brand-primary shadow-[0_0_15px_#16A34A] animate-[scan_2s_infinite_linear]" />
            )}

            {/* Camera Overlay Caption */}
            <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md rounded-xl p-2.5 text-center text-white">
              <p className="text-xs font-semibold">Point your camera at the scrap items</p>
              <p className="text-[10px] text-white/80">AI will detect and identify materials automatically</p>
            </div>
          </div>

          {/* Detection Model info */}
          <div className="flex items-center justify-between bg-brand-bg rounded-xl p-3 text-xs border border-brand-border">
            <div>
              <span className="text-brand-text-secondary block text-[10px] font-semibold uppercase">Detection Model</span>
              <span className="font-bold text-brand-text flex items-center gap-1">
                <span>⚡ OpenRouter AI</span>
                <span className="text-brand-primary text-[10px] font-semibold">(Free)</span>
              </span>
            </div>
            <span className="text-brand-text-secondary text-[11px] font-medium">Fast • Accurate • Free</span>
          </div>

          {/* Action Button */}
          <button
            onClick={onDetectItems}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                <span>Analyzing your scrap...</span>
              </>
            ) : (
              <>
                <span>✨ Detect Items</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
          <p className="text-[10px] text-brand-text-secondary text-center">AI will identify materials in your images</p>
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 95%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
