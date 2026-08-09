import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import {
  analyzeScrapImageWithOpenRouter,
  fileToBase64,
  type AIDetectedItem,
} from '../services/openRouterService';

export default function SellScrap() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { selectedCity } = useCity();

  // Current Step: 1 = Upload, 2 = Detection Result, 3 = Weight Input, 4 = Estimated Value, 5 = Collector, 6 = Pickup Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 2 & 3 State
  const [detectedItems, setDetectedItems] = useState<AIDetectedItem[]>([]);

  // Step 5 State (Collector)
  const [selectedCollector, setSelectedCollector] = useState<{
    id: string;
    name: string;
    rating: number;
    distance: string;
    address: string;
    freePickup: boolean;
  }>({
    id: 'col-1',
    name: 'Raj Scrap Center',
    rating: 4.8,
    distance: '1.2 km',
    address: `${selectedCity}, Maharashtra`,
    freePickup: true,
  });

  // Step 6 State (Confirmation)
  const [requestId, setRequestId] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ─── Step 1 Handlers: File Select & OpenRouter AI Analysis ───────────────

  const handleImageProcess = async (file: File) => {
    try {
      setErrorMessage(null);
      const base64 = await fileToBase64(file);
      setUploadedImage(base64);
      setIsAnalyzing(true);

      // Call OpenRouter API Vision analysis
      const result = await analyzeScrapImageWithOpenRouter(base64, selectedCity);

      setIsAnalyzing(false);

      if (!result.items || result.items.length === 0) {
        setErrorMessage("We couldn't analyze that image. No recognizable scrap items were detected.");
        return;
      }

      setDetectedItems(result.items);
      setCurrentStep(2); // Advance to Step 2: Detection Result
    } catch (err: any) {
      console.error(err);
      setIsAnalyzing(false);
      if (err?.message === 'IMAGE_TOO_LARGE') {
        setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller photo.');
      } else {
        setErrorMessage("We couldn't analyze that image. Please try another clear photo.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageProcess(e.dataTransfer.files[0]);
    }
  };

  const handleResetUpload = () => {
    setUploadedImage(null);
    setDetectedItems([]);
    setIsAnalyzing(false);
    setErrorMessage(null);
    setCurrentStep(1);
  };

  // ─── Step 3 Weight Input Handler ─────────────────────────────────────────

  const handleWeightChange = (id: string, valStr: string) => {
    const num = parseFloat(valStr);
    const weight = isNaN(num) || num < 0 ? 0 : num;
    setDetectedItems((prev) =>
      prev.map((item) => (item.matchedScrapId === id ? { ...item, weightKg: weight } : item))
    );
  };

  // ─── Total Calculation for Step 4 & 6 ───────────────────────────────────

  const totalEstimatedValue = detectedItems.reduce(
    (acc, item) => acc + item.pricePerKg * item.weightKg,
    0
  );

  // ─── Demo Collectors List for Step 5 ────────────────────────────────────

  const nearbyCollectors = [
    {
      id: 'col-1',
      name: 'Raj Scrap Center',
      rating: 4.8,
      distance: '1.2 km',
      address: `Kothrud, ${selectedCity}`,
      freePickup: true,
    },
    {
      id: 'col-2',
      name: 'GreenCycle Scrap Solutions',
      rating: 4.9,
      distance: '2.1 km',
      address: `Viman Nagar, ${selectedCity}`,
      freePickup: true,
    },
    {
      id: 'col-3',
      name: 'EcoScrap Traders',
      rating: 4.6,
      distance: '3.4 km',
      address: `Hadapsar, ${selectedCity}`,
      freePickup: true,
    },
  ];

  const handleConfirmPickup = () => {
    if (!user) {
      openAuthModal('sell-scrap');
      return;
    }
    const generatedId = `SN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRequestId(generatedId);
    setIsConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      {/* Stepper Header Bar */}
      <div className="w-full bg-brand-card border-b border-brand-border py-3.5 px-4 sm:px-8 shadow-2xs sticky top-16 z-30">
        <div className="max-w-xl mx-auto flex items-center justify-between relative">
          {/* Stepper Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-border -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 transition-all duration-300 z-0"
            style={{ width: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%` }}
          />

          {[
            { id: 1, label: 'Upload' },
            { id: 2, label: 'Review' },
            { id: 3, label: 'Value' },
            { id: 4, label: 'Collector' },
            { id: 5, label: 'Pickup' },
          ].map((s) => {
            const stepNum = s.id;
            const isCurrent = currentStep === stepNum || (currentStep === 6 && stepNum === 5);
            const isCompleted = currentStep > stepNum;

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (isCompleted && !isAnalyzing) setCurrentStep(stepNum);
                }}
                className="relative z-10 flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : isCurrent
                      ? 'bg-brand-primary text-white ring-4 ring-brand-light shadow-xs scale-105'
                      : 'bg-brand-card border border-brand-border text-brand-text-secondary'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                    isCurrent
                      ? 'text-brand-primary font-bold'
                      : isCompleted
                      ? 'text-brand-text'
                      : 'text-brand-text-secondary'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">

        {/* Hero Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Sell Your Scrap
          </h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm">
            Take a photo of your scrap and let AI identify it.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 1 — UPLOAD SCRAP (Initial state, single clean card)
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="animate-[fadeIn_200ms_ease-out]">
            {!isAnalyzing ? (
              <div className="space-y-4">
                {/* Upload Card */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="bg-brand-card border border-brand-border rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-6"
                >
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                    📷
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-text">Upload your scrap</h3>
                    <p className="text-brand-text-secondary text-xs">
                      Take a clear photo or select an image from your device.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Take Photo</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-card border border-brand-border hover:border-brand-primary text-brand-text font-bold text-sm hover:bg-brand-bg transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Upload Image</span>
                    </button>
                  </div>

                  {/* Hidden inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
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

                {/* Error Banner state */}
                {errorMessage && (
                  <div className="bg-brand-card border border-red-200 rounded-2xl p-5 text-center space-y-3 animate-[fadeIn_200ms_ease-out]">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                      ⚠️
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">We couldn't analyze that image</h4>
                      <p className="text-brand-text-secondary text-xs mt-1">{errorMessage}</p>
                    </div>
                    <button
                      onClick={handleResetUpload}
                      className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-dark transition cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Analyzing State */
              <div className="bg-brand-card border border-brand-border rounded-3xl p-8 text-center shadow-md space-y-5 animate-[fadeIn_200ms_ease-out]">
                {uploadedImage && (
                  <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-brand-border shadow-md">
                    <img src={uploadedImage} alt="Uploaded scrap" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 h-1 bg-brand-primary shadow-[0_0_15px_#16A34A] animate-[scan_1.5s_infinite_linear]" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-brand-primary">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    <h3 className="text-lg font-bold text-brand-text">Analyzing your scrap...</h3>
                  </div>
                  <p className="text-brand-text-secondary text-xs">
                    ScrapNow AI is identifying your items
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 2 — AI DETECTION RESULT
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-lg font-bold text-brand-text">We found your scrap ♻️</h3>
              <span className="text-xs font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full border border-brand-primary/20">
                AI Verified
              </span>
            </div>

            {/* Uploaded Thumbnail */}
            {uploadedImage && (
              <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-2xl border border-brand-border">
                <img src={uploadedImage} alt="Uploaded thumbnail" className="w-16 h-16 rounded-xl object-cover border border-brand-border" />
                <span className="text-xs font-bold text-brand-text-secondary">📷 uploaded image</span>
              </div>
            )}

            {/* AI Detected Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">AI detected</h4>
              {detectedItems.map((item) => (
                <div
                  key={item.matchedScrapId}
                  className="p-3.5 rounded-2xl border border-brand-border bg-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm sm:text-base">{item.name}</h4>
                      <span className="text-[10px] text-brand-text-secondary font-medium">{item.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full border border-brand-primary/20">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
              >
                Looks Correct ✓
              </button>

              <button
                onClick={handleResetUpload}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-brand-bg text-brand-text font-semibold text-sm hover:bg-brand-light border border-brand-border transition-all cursor-pointer"
              >
                Try Another Photo
              </button>
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 3 — USER ENTERS WEIGHT
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            
            <div className="pb-3 border-b border-brand-border">
              <h3 className="text-lg font-bold text-brand-text">How much scrap do you have?</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Enter estimated quantity in kg for each material
              </p>
            </div>

            {/* List of items with weight inputs */}
            <div className="space-y-4">
              {detectedItems.map((item) => {
                const subtotal = item.pricePerKg * item.weightKg;

                return (
                  <div key={item.matchedScrapId} className="p-4 rounded-2xl border border-brand-border bg-brand-bg/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <h4 className="font-bold text-brand-text text-sm sm:text-base">{item.name}</h4>
                      </div>
                      <span className="text-xs font-bold text-brand-primary">
                        ₹{item.pricePerKg} / {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <label htmlFor={`weight-input-${item.matchedScrapId}`} className="text-xs font-semibold text-brand-text-secondary">
                          Weight:
                        </label>
                        <div className="relative w-28">
                          <input
                            id={`weight-input-${item.matchedScrapId}`}
                            type="number"
                            step="1"
                            min="1"
                            value={item.weightKg}
                            onChange={(e) => handleWeightChange(item.matchedScrapId, e.target.value)}
                            className="w-full pl-3 pr-8 py-2 text-sm font-bold text-brand-text border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary bg-white text-right shadow-2xs"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-text-secondary">
                            kg
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-brand-text-secondary block font-medium">Estimated value</span>
                        <span className="font-extrabold text-brand-primary text-base">₹{subtotal.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setCurrentStep(4)}
              className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue →</span>
            </button>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 4 — ESTIMATED VALUE SUMMARY
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            
            <div className="text-center space-y-1 pb-4 border-b border-brand-border">
              <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
                Your Estimated Scrap Value
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                ₹{totalEstimatedValue.toFixed(0)}
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-2">
              {detectedItems.map((item) => {
                const subtotal = item.pricePerKg * item.weightKg;
                return (
                  <div key={item.matchedScrapId} className="flex items-center justify-between text-xs sm:text-sm bg-brand-bg/60 p-3 rounded-xl border border-brand-border/60">
                    <span className="font-semibold text-brand-text">
                      {item.name} <span className="text-brand-text-secondary font-normal ml-2">{item.weightKg} kg × ₹{item.pricePerKg}</span>
                    </span>
                    <span className="font-extrabold text-brand-text">₹{subtotal.toFixed(0)}</span>
                  </div>
                );
              })}

              <div className="pt-2 flex justify-between text-sm font-extrabold text-brand-text border-t border-brand-border">
                <span>Estimated Total</span>
                <span className="text-brand-primary">₹{totalEstimatedValue.toFixed(0)}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-brand-bg border border-brand-border rounded-xl p-3.5 text-xs text-brand-text-secondary text-center leading-relaxed">
              Final amount may vary after the collector weighs your scrap.
            </div>

            {/* Find Collector Action */}
            <button
              onClick={() => setCurrentStep(5)}
              className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
            >
              Find a Collector →
            </button>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 5 — CHOOSE COLLECTOR
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && !isConfirmed && (
          <div className="space-y-4 animate-[fadeIn_200ms_ease-out]">
            <div className="text-center space-y-1 mb-2">
              <h3 className="text-xl font-bold text-brand-text">Verified Collectors near {selectedCity}</h3>
              <p className="text-brand-text-secondary text-xs">
                Select your preferred collector for free doorstep pickup
              </p>
            </div>

            {nearbyCollectors.map((c) => (
              <div
                key={c.id}
                className="bg-brand-card border border-brand-border hover:border-brand-primary rounded-2xl p-5 shadow-xs transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-brand-text text-base">{c.name}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-brand-text-secondary font-medium">
                    <span className="text-amber-600 font-bold">⭐ {c.rating}</span>
                    <span>• 📍 {c.distance}</span>
                    <span className="text-emerald-700 font-bold">• Free Pickup</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCollector(c);
                    setCurrentStep(6);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-dark transition cursor-pointer flex-shrink-0"
                >
                  Choose Collector
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 6 — PICKUP CONFIRMATION & RECEIPT
           ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 6 && (
          <div className="animate-[fadeIn_200ms_ease-out]">
            {!isConfirmed ? (
              <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-3 border-b border-brand-border text-center">
                  <h3 className="text-xl font-bold text-brand-text">Pickup Summary</h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Review details before confirming request
                  </p>
                </div>

                <div className="bg-brand-bg/60 border border-brand-border rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-brand-text-secondary">Scrap Value</span>
                    <span className="font-extrabold text-brand-primary text-base">
                      ₹{totalEstimatedValue.toFixed(0)} estimated
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-brand-text-secondary">Collector</span>
                    <span className="font-bold text-brand-text">{selectedCollector.name}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-brand-text-secondary">Location</span>
                    <span className="font-semibold text-brand-text">{selectedCity}, Maharashtra</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Pickup</span>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPickup}
                  className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
                >
                  Confirm Pickup
                </button>
              </div>
            ) : (
              /* Receipt Card */
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-5 animate-[fadeIn_200ms_ease-out]">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm text-3xl font-bold">
                  🎉
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-emerald-950">🎉 Pickup Request Confirmed!</h3>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    Your collector will contact you shortly.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 text-xs text-left space-y-2 border border-emerald-200 shadow-2xs font-mono max-w-sm mx-auto">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-gray-500">Request ID:</span>
                    <span className="font-bold text-gray-900">{requestId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-gray-500">Collector:</span>
                    <span className="font-bold text-gray-900">{selectedCollector.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-gray-500">Estimated Value:</span>
                    <span className="font-extrabold text-emerald-600">₹{totalEstimatedValue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-semibold text-gray-900">{selectedCity}, Maharashtra</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('/')}
                    className="py-3 px-6 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition cursor-pointer"
                  >
                    View Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
      <AuthModal />

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 95%; }
          100% { top: 0%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
