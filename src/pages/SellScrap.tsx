import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { scrapItems, type ScrapItem } from '../data/scrapItems';

import { ProgressStepper } from '../components/sell-scrap/ProgressStepper';
import { AIBanner } from '../components/sell-scrap/AIBanner';
import { ScrapUploader } from '../components/sell-scrap/ScrapUploader';
import { AIDetection } from '../components/sell-scrap/AIDetection';
import { ScrapSummary } from '../components/sell-scrap/ScrapSummary';
import { CollectorSelection, sampleCollectors } from '../components/sell-scrap/CollectorSelection';
import { type CollectorData } from '../components/sell-scrap/CollectorMap';
import { PickupConfirmation } from '../components/sell-scrap/PickupConfirmation';
import { CollectorWeightEntry } from '../components/sell-scrap/CollectorWeightEntry';
import { TransactionSummary } from '../components/sell-scrap/TransactionSummary';

export default function SellScrap() {
  const { user } = useAuth();

  // Workflow Step State (1: Add, 2: Detected Items, 3: Quotes, 4: Collector, 5: Pickup & Weighing, 6: Get Paid)
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Uploaded images & AI state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Detected Scrap items (defaults to Newspaper, Plastic Bottles, Aluminium for demo)
  const [detectedItems, setDetectedItems] = useState<ScrapItem[]>([
    scrapItems[0], // Newspaper
    scrapItems[2], // Plastic Bottles
    scrapItems[4], // Aluminium
  ]);

  // Selected Collector & Offer
  const [selectedCollector, setSelectedCollector] = useState<CollectorData | null>(sampleCollectors[0]);

  // Pickup Details
  const [pickupDetails, setPickupDetails] = useState<{ address: string; timeSlot: string } | null>(null);

  // Physical weights entered by collector
  const [finalWeightEntries, setFinalWeightEntries] = useState<
    Array<{ item: ScrapItem; collectorRate: number; weightKg: number }>
  >([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState<number>(0);

  // Event Handlers
  const handleImagesSelected = (files: File[]) => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setUploadedImages((prev) => [...prev, ...urls]);
  };

  const handleDetectItems = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Advance to Step 2 (Detected Items)
      setCurrentStep(2);
    }, 1500);
  };

  const handleRemoveDetectedItem = (id: string) => {
    setDetectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddMoreItem = () => {
    // Add next available item from scrapItems dataset
    const existingIds = new Set(detectedItems.map((i) => i.id));
    const nextItem = scrapItems.find((i) => !existingIds.has(i.id)) || scrapItems[1];
    setDetectedItems((prev) => [...prev, nextItem]);
  };

  const handleProceedToQuotes = () => {
    setCurrentStep(3);
    // Smooth scroll to top of workflow
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleProceedToPickup = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleConfirmPickup = (details: { address: string; timeSlot: string }) => {
    setPickupDetails(details);
    // Remains on step 5, but switches to physical weight entry simulator
  };

  const handleSubmitWeights = (
    entries: Array<{ item: ScrapItem; collectorRate: number; weightKg: number }>,
    total: number
  ) => {
    setFinalWeightEntries(entries);
    setFinalTotalAmount(total);
    setCurrentStep(6); // Step 6: Get Paid
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      {/* Progress Stepper Bar */}
      <ProgressStepper currentStep={currentStep} onStepClick={handleStepClick} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">Sell Scrap</h1>
            <p className="text-brand-text-secondary text-sm mt-1">
              Get the best price for your recyclable materials in Pune
            </p>
          </div>
        </div>

        {/* AI Banner */}
        <AIBanner />

        {/* Main Content Grid: Workflow (Left) + Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Interactive Workflow (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: Upload & Camera */}
            {currentStep === 1 && (
              <ScrapUploader
                onImagesSelected={handleImagesSelected}
                onDetectItems={handleDetectItems}
                isAnalyzing={isAnalyzing}
                uploadedImages={uploadedImages}
              />
            )}

            {/* STEP 2: AI Detection Results */}
            {currentStep === 2 && (
              <AIDetection
                detectedItems={detectedItems}
                onRemoveItem={handleRemoveDetectedItem}
                onAddItem={handleAddMoreItem}
                onProceedToQuotes={handleProceedToQuotes}
              />
            )}

            {/* STEP 3 & 4: Choose Collector & Get Quotes */}
            {(currentStep === 3 || currentStep === 4) && (
              <CollectorSelection
                detectedItems={detectedItems}
                selectedCollector={selectedCollector}
                onSelectCollector={(c) => setSelectedCollector(c)}
                onProceedToPickup={handleProceedToPickup}
              />
            )}

            {/* STEP 5: Pickup Confirmation & Weight Entry Simulator */}
            {currentStep === 5 && (
              <>
                {!pickupDetails ? (
                  <PickupConfirmation
                    collector={selectedCollector || sampleCollectors[0]}
                    items={detectedItems}
                    userName={user?.name || 'Valued User'}
                    userPhone={user?.phone || '9876543210'}
                    onConfirmPickup={handleConfirmPickup}
                  />
                ) : (
                  <CollectorWeightEntry
                    collector={selectedCollector || sampleCollectors[0]}
                    items={detectedItems}
                    onSubmitWeights={handleSubmitWeights}
                  />
                )}
              </>
            )}

            {/* STEP 6: Get Paid & Final Amount Receipt */}
            {currentStep === 6 && (
              <TransactionSummary
                collector={selectedCollector || sampleCollectors[0]}
                itemsWithWeights={finalWeightEntries}
                totalAmount={finalTotalAmount}
                userName={user?.name || 'Valued User'}
                userPhone={user?.phone || '9876543210'}
                onCompleteSelling={() => {}}
              />
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Scrap Summary (4 cols on desktop) */}
          <div className="lg:col-span-4">
            <ScrapSummary
              items={detectedItems}
              selectedCollectorOffer={
                selectedCollector
                  ? {
                      collectorName: selectedCollector.name,
                      offeredRates: selectedCollector.offeredRates,
                    }
                  : null
              }
            />
          </div>

        </div>

        {/* Bottom "How It Works" Process Cards matching reference design */}
        <div className="pt-8 border-t border-brand-border">
          <h2 className="text-xl font-bold text-brand-text mb-2">How ScrapNow Works</h2>
          <p className="text-brand-text-secondary text-xs mb-6">Simple steps to sell your scrap hassle-free</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                📷
              </div>
              <div>
                <h3 className="font-bold text-xs text-brand-text">1 Add Scrap</h3>
                <p className="text-[10px] text-brand-text-secondary">Upload photos of items</p>
              </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-xs text-brand-text">2 AI Detection</h3>
                <p className="text-[10px] text-brand-text-secondary">AI identifies materials</p>
              </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🏷️
              </div>
              <div>
                <h3 className="font-bold text-xs text-brand-text">3 Get Quotes</h3>
                <p className="text-[10px] text-brand-text-secondary">Receive best prices</p>
              </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🚚
              </div>
              <div>
                <h3 className="font-bold text-xs text-brand-text">4 Pickup</h3>
                <p className="text-[10px] text-brand-text-secondary">Free pickup at home</p>
              </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                💰
              </div>
              <div>
                <h3 className="font-bold text-xs text-brand-text">5 Get Paid</h3>
                <p className="text-[10px] text-brand-text-secondary">Instant spot payment</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
