import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth, type PickupItem } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import {
  analyzeScrapImageWithOpenRouter,
  fileToBase64,
  type AIDetectedItem,
} from '../services/openRouterService';
import { getScrapItemsForCity } from '../data/scrapItems';

export default function SellScrap() {
  const navigate = useNavigate();
  const { user, addPickupRequest } = useAuth();
  const { selectedCity } = useCity();

  // Current Step state (1: Upload, 2: Review Items, 3: Address & Time, 4: Confirmed Receipt)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // File Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Detected Items State
  const [detectedItems, setDetectedItems] = useState<AIDetectedItem[]>([]);

  // Pickup Details State
  const [pickupAddress, setPickupAddress] = useState(
    'Flat 402, Mayur Colony, Kothrud, Pune, Maharashtra - 411038'
  );
  const [timeSlot, setTimeSlot] = useState('Today, 4:00 PM');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedRequestId, setConfirmedRequestId] = useState<string | null>(null);

  // Handle file drop / upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  // Image Processing & AI Detection
  const processImageFile = async (file: File) => {
    setErrorMessage(null);
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      setUploadedImage(base64);

      const aiResult = await analyzeScrapImageWithOpenRouter(base64, selectedCity);
      if (aiResult.items.length === 0) {
        setErrorMessage("We couldn't identify scrap items in this image. Try uploading a clearer photo.");
        setIsAnalyzing(false);
        return;
      }

      setDetectedItems(aiResult.items);
      setIsAnalyzing(false);
      setCurrentStep(2);
    } catch (err: any) {
      setIsAnalyzing(false);
      if (err.message === 'IMAGE_TOO_LARGE') {
        setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller photo.');
      } else {
        setErrorMessage('Failed to connect to AI scanner. Please try again.');
      }
    }
  };

  const handleResetUpload = () => {
    setUploadedImage(null);
    setDetectedItems([]);
    setErrorMessage(null);
    setIsAnalyzing(false);
    setCurrentStep(1);
  };

  // Item modifications
  const handleUpdateItemWeight = (index: number, newWeight: number) => {
    setDetectedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], weightKg: Math.max(1, newWeight) };
      return updated;
    });
  };

  const handleRemoveDetectedItem = (index: number) => {
    setDetectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddManualItem = () => {
    const cityItems = getScrapItemsForCity(selectedCity);
    const item = cityItems[0];
    const newItem: AIDetectedItem = {
      name: item.name,
      category: item.category as any,
      confidence: 1.0,
      pricePerKg: item.price,
      unit: item.unit,
      weightKg: 5,
      icon: '📦',
      matchedScrapId: item.id,
    };
    setDetectedItems((prev) => [...prev, newItem]);
  };

  // Calculations
  const totalEstimatedValue = detectedItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.weightKg,
    0
  );

  // Submit Request to Database
  const handleConfirmPickup = () => {
    if (detectedItems.length === 0) {
      alert('Please keep at least one item to request a pickup.');
      return;
    }

    const itemsForPayload: PickupItem[] = detectedItems.map((item, i) => ({
      id: item.matchedScrapId || `item-${i}`,
      name: item.name,
      category: item.category,
      weightKg: item.weightKg,
      pricePerKg: item.pricePerKg,
      amount: Math.round(item.weightKg * item.pricePerKg),
    }));

    const newReq = addPickupRequest({
      userId: user?.userId || 'guest-user',
      userName: user?.name || 'Shubham Sutar',
      userPhone: user?.phone || '9876543210',
      collectorId: '',
      collectorName: 'Not assigned yet',
      collectorRating: 4.8,
      collectorDistance: 'Nearby',
      collectorAddress: selectedCity,
      pickupAddress: pickupAddress,
      timeSlot: timeSlot,
      estimatedValue: Math.round(totalEstimatedValue),
      status: 'Pending Pickup',
      items: itemsForPayload,
    });

    setConfirmedRequestId(newReq.id);
    setIsConfirmed(true);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between font-sans">
      <Navbar />
      <AuthModal />

      {/* Progressive Disclosure Stepper Bar */}
      <div className="sticky top-16 z-40 bg-brand-card/90 backdrop-blur-md border-b border-brand-border py-3">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          {[
            { num: 1, label: 'Add Scrap' },
            { num: 2, label: 'Detected Items' },
            { num: 3, label: 'Address & Schedule' },
            { num: 4, label: 'Request Pickup' },
          ].map((s) => {
            const stepNum = s.num as 1 | 2 | 3 | 4;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div key={s.num} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    isCompleted
                      ? 'bg-brand-primary text-white'
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

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Sell Your Scrap ♻️
          </h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm">
            AI material detection & doorstep pickup in {selectedCity}
          </p>
        </div>

        {/* STEP 1 — UPLOAD SCRAP */}
        {currentStep === 1 && (
          <div className="animate-[fadeIn_200ms_ease-out]">
            {!isAnalyzing ? (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="bg-brand-card border border-brand-border rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-6"
                >
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                    📷
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-text">Upload clear images of your scrap</h3>
                    <p className="text-brand-text-secondary text-xs">
                      Take a photo or upload from device for AI material detection.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>📷 Take Photo</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-card border border-brand-border hover:border-brand-primary text-brand-text font-bold text-sm hover:bg-brand-bg transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>📁 Upload Image</span>
                    </button>
                  </div>

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

                {errorMessage && (
                  <div className="bg-brand-card border border-red-200 rounded-2xl p-5 text-center space-y-3 animate-[fadeIn_200ms_ease-out]">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                      ⚠️
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">Image Scanner Alert</h4>
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
                    ScrapNow AI is identifying your recyclable materials
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — REVIEW DETECTED ITEMS */}
        {currentStep === 2 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <h3 className="text-lg font-bold text-brand-text">AI Identified Items ♻️</h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">Verify and edit estimated weights</p>
              </div>
              <span className="text-xs font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full border border-brand-primary/20">
                ✦ Vision AI
              </span>
            </div>

            <div className="space-y-3">
              {detectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-brand-bg/60 border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-2xs border border-brand-border">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">{item.name}</h4>
                      <p className="text-xs text-brand-text-secondary">
                        {item.category} • ₹{item.pricePerKg}/{item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemWeight(idx, item.weightKg - 1)}
                        className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border font-bold text-brand-text hover:bg-brand-bg flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-brand-text w-12 text-center">
                        {item.weightKg} kg
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemWeight(idx, item.weightKg + 1)}
                        className="w-7 h-7 rounded-lg bg-brand-card border border-brand-border font-bold text-brand-text hover:bg-brand-bg flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-extrabold text-brand-primary text-sm min-w-[60px] text-right">
                      ₹{item.weightKg * item.pricePerKg}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveDetectedItem(idx)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs p-1 cursor-pointer"
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddManualItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-brand-primary text-brand-primary font-bold text-xs hover:bg-brand-light/50 transition cursor-pointer"
              >
                + Add Another Scrap Item
              </button>
            </div>

            <div className="flex items-center justify-between bg-brand-light/60 p-4 rounded-2xl border border-brand-primary/20">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Estimated Scrap Value:
              </span>
              <span className="text-xl font-extrabold text-brand-primary">
                ₹{totalEstimatedValue.toFixed(0)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleResetUpload}
                className="py-3 px-5 rounded-xl border border-brand-border text-brand-text font-bold text-xs hover:bg-brand-bg transition cursor-pointer"
              >
                Retake Photo
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-3 px-6 rounded-xl bg-brand-primary text-white font-bold text-xs sm:text-sm hover:bg-brand-dark transition shadow-2xs cursor-pointer"
              >
                Continue to Address & Schedule →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — ADDRESS & SCHEDULE */}
        {currentStep === 3 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            <div className="pb-3 border-b border-brand-border">
              <h3 className="text-lg font-bold text-brand-text">Pickup Address & Schedule 📍</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Registered collectors in {selectedCity} will receive your order
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-text uppercase tracking-wider mb-1">
                  Pickup Address *
                </label>
                <textarea
                  rows={3}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-xs focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-text uppercase tracking-wider mb-1">
                  Preferred Pickup Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-xs focus:outline-none focus:border-brand-primary font-medium"
                >
                  <option>Today, 4:00 PM</option>
                  <option>Today, 6:00 PM</option>
                  <option>Tomorrow, 10:30 AM</option>
                  <option>Tomorrow, 2:30 PM</option>
                </select>
              </div>

              <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Est. Total Scrap Value:</span>
                  <span className="font-extrabold text-brand-primary">₹{totalEstimatedValue.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Assigned Collector:</span>
                  <span className="font-semibold text-brand-text">Auto-matching active collectors in {selectedCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">Pickup Fee:</span>
                  <span className="font-bold text-emerald-600">FREE Doorstep Pickup</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-3 px-5 rounded-xl border border-brand-border text-brand-text font-bold text-xs hover:bg-brand-bg transition cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleConfirmPickup}
                className="flex-1 py-3.5 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-sm hover:bg-brand-dark transition shadow-md cursor-pointer"
              >
                Request Pickup →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONFIRMED RECEIPT */}
        {currentStep === 4 && isConfirmed && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-5 animate-[fadeIn_200ms_ease-out]">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm text-3xl font-bold">
              🎉
            </div>

            <div>
              <h3 className="text-2xl font-bold text-emerald-950">Pickup Request Submitted!</h3>
              <p className="text-xs text-emerald-800 mt-1 font-medium">
                Your request has been broadcasted to registered collectors in {selectedCity}.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-xs text-left space-y-2 border border-emerald-200 shadow-2xs font-mono max-w-sm mx-auto">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Request ID:</span>
                <span className="font-bold text-gray-900">{confirmedRequestId}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-amber-700">PENDING PICKUP</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Estimated Value:</span>
                <span className="font-extrabold text-emerald-600">₹{totalEstimatedValue.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pickup Address:</span>
                <span className="font-semibold text-gray-900 truncate max-w-[180px]">{pickupAddress}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-sm hover:bg-brand-dark transition shadow-md cursor-pointer"
              >
                Track Pickup in Dashboard →
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
