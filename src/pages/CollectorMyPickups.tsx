import { useState } from 'react';
import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import {
  useAuth,
  type PickupRequest,
  type PickupStatus,
  type PickupItem,
} from '../context/AuthContext';

export default function CollectorMyPickups() {
  const { pickups, updatePickupStatus, updatePickupItems } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Weigh & Collect Modal State (ONLY accessible in 'Arrived' or 'Scrap Collected' states!)
  const [weighingRequest, setWeighingRequest] = useState<PickupRequest | null>(null);
  const [editableItems, setEditableItems] = useState<PickupItem[]>([]);

  // Collector's active pickups (excluding completed/rejected)
  const myActivePickups = pickups.filter(
    (p) =>
      p.status === 'Accepted' ||
      p.status === 'Collector Confirmed' ||
      p.status === 'On the Way' ||
      p.status === 'Arrived' ||
      p.status === 'Scrap Collected'
  );

  const myCompletedPickups = pickups.filter((p) => p.status === 'Completed');

  // Handle status advances strictly matching the 5-state lifecycle
  const handleStatusAdvance = (req: PickupRequest) => {
    let nextStatus: PickupStatus = 'On the Way';

    if (req.status === 'Accepted' || req.status === 'Collector Confirmed') {
      nextStatus = 'On the Way';
      updatePickupStatus(req.id, nextStatus, 'Cash');
      setToastMessage(`🚗 Pickup #${req.id} started! Status: On the Way`);
    } else if (req.status === 'On the Way') {
      nextStatus = 'Arrived';
      updatePickupStatus(req.id, nextStatus, 'Cash');
      setToastMessage(`📍 Arrived at customer address for #${req.id}!`);
    } else if (req.status === 'Arrived') {
      // Transition to Weigh & Collect state and open Weighing Modal
      handleOpenWeighingModal(req);
      return;
    } else if (req.status === 'Scrap Collected') {
      handleOpenWeighingModal(req);
      return;
    }

    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Weighing & Scale Entry Modal (ONLY after reaching Arrived state)
  const handleOpenWeighingModal = (req: PickupRequest) => {
    if (req.status !== 'Arrived' && req.status !== 'Scrap Collected') {
      alert('Physical scale weighing is only allowed after arriving at customer address.');
      return;
    }
    setWeighingRequest(req);
    // Deep clone items array for editing scale weights
    setEditableItems(
      req.items.map((item) => ({
        ...item,
      }))
    );
  };

  // Modify individual item in scale state
  const handleItemFieldChange = (
    index: number,
    field: keyof PickupItem,
    value: string | number
  ) => {
    setEditableItems((prev) => {
      const next = [...prev];
      const target = { ...next[index] };

      if (field === 'weightKg' || field === 'pricePerKg') {
        const numVal = parseFloat(value as string);
        const safeNum = isNaN(numVal) || numVal < 0 ? 0 : numVal;
        (target as any)[field] = safeNum;
        target.amount = Math.round(target.weightKg * target.pricePerKg);
      } else {
        (target as any)[field] = value;
      }

      next[index] = target;
      return next;
    });
  };

  // Add new item row during scale weighing
  const handleAddItem = () => {
    const newItem: PickupItem = {
      id: `item-${Date.now()}`,
      name: 'Cardboard Box',
      category: 'Paper',
      weightKg: 5,
      pricePerKg: 10,
      amount: 50,
    };
    setEditableItems((prev) => [...prev, newItem]);
  };

  // Remove item row
  const handleRemoveItem = (index: number) => {
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Confirm Collection & Payment (Creates Transaction & Completes Order)
  const handleConfirmCollectionAndPayment = () => {
    if (!weighingRequest) return;

    if (editableItems.length === 0) {
      alert('Please keep at least one scrap item in the list.');
      return;
    }

    // Save final measured scale items & recalculated total
    updatePickupItems(weighingRequest.id, editableItems);

    // Complete Pickup Request -> Creates Transaction & Updates Cash Paid
    updatePickupStatus(weighingRequest.id, 'Completed', 'Cash');

    setToastMessage(`🎉 Collection & Payment Confirmed for #${weighingRequest.id}! Transaction created.`);
    setWeighingRequest(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate live total during scale weighing
  const liveRecalculatedTotal = editableItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.weightKg,
    0
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <CollectorNavbar />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-[slideDown_200ms_ease-out]">
          {toastMessage}
        </div>
      )}

      {/* 4. Weigh & Collect Modal (ONLY accessible after Arrival) */}
      {weighingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setWeighingRequest(null)} />
          
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full z-10 space-y-5 shadow-2xl relative animate-[slideUp_200ms_ease-out]">
            <button
              onClick={() => setWeighingRequest(null)}
              className="absolute top-5 right-5 text-brand-text-secondary hover:text-brand-text p-1 text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                Step 4 — Weigh & Collect (Doorstep Physical Scale)
              </span>
              <h3 className="text-xl font-extrabold text-brand-text mt-1">
                Enter Measured Scale Weights (#{weighingRequest.id})
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Enter actual physical scale measured weight for each item to compute final payout.
              </p>
            </div>

            {/* Customer Header */}
            <div className="bg-brand-bg p-3.5 rounded-2xl border border-brand-border text-xs flex justify-between items-center">
              <div>
                <span className="text-brand-text-secondary block font-semibold">Customer:</span>
                <span className="font-bold text-brand-text">{weighingRequest.userName} (+91 {weighingRequest.userPhone})</span>
                <p className="text-[11px] text-brand-text-secondary truncate max-w-[240px]">{weighingRequest.pickupAddress}</p>
              </div>
              <div className="text-right">
                <span className="text-brand-text-secondary block font-semibold">Final Payout Amount:</span>
                <span className="font-extrabold text-brand-primary text-xl">₹{liveRecalculatedTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Item Scale Inputs & Breakdown */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider block">
                Measured Scrap Items & Weights
              </span>

              {editableItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl border border-brand-border bg-white space-y-2.5 shadow-2xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Item Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemFieldChange(idx, 'name', e.target.value)}
                        className="w-full p-2 text-xs font-bold text-brand-text border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemFieldChange(idx, 'category', e.target.value)}
                        className="w-full p-2 text-xs font-semibold text-brand-text border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary"
                      >
                        <option value="Paper">Paper</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Metal">Metal</option>
                        <option value="E-waste">E-waste</option>
                        <option value="Rubber">Rubber</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Scale Measured Weight */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                          Scale Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={item.weightKg}
                          onChange={(e) => handleItemFieldChange(idx, 'weightKg', e.target.value)}
                          className="w-full p-2 text-xs font-extrabold text-brand-primary border border-brand-primary rounded-xl focus:outline-none bg-brand-light/30 text-right"
                        />
                      </div>

                      <div className="w-20">
                        <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                          Rate (₹/kg)
                        </label>
                        <input
                          type="number"
                          value={item.pricePerKg}
                          onChange={(e) => handleItemFieldChange(idx, 'pricePerKg', e.target.value)}
                          className="w-full p-2 text-xs font-bold text-brand-text border border-brand-border rounded-xl focus:outline-none"
                        />
                      </div>

                      {editableItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold pt-4 px-1"
                          title="Remove Item"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Single Line Breakdown Formula */}
                  <div className="text-right text-xs pt-1 border-t border-brand-border/40 font-mono">
                    <span className="text-brand-text-secondary">{item.name}: </span>
                    <span className="font-bold text-brand-text">{item.weightKg} kg × ₹{item.pricePerKg} = </span>
                    <span className="font-extrabold text-brand-primary">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-brand-primary text-brand-primary font-bold text-xs hover:bg-brand-light/50 transition cursor-pointer"
              >
                + Add Another Scrap Item
              </button>
            </div>

            {/* Total Itemized Breakdown Summary */}
            <div className="bg-brand-bg/80 p-3.5 rounded-2xl border border-brand-border space-y-1.5 text-xs">
              <div className="font-bold text-brand-text uppercase tracking-wider text-[11px] border-b pb-1">
                Final Payout Breakdown
              </div>
              {editableItems.map((item, i) => (
                <div key={i} className="flex justify-between font-mono">
                  <span>{item.name}: {item.weightKg} kg × ₹{item.pricePerKg}</span>
                  <span className="font-bold text-brand-text">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-brand-border">
                <span>Total Cash Payout:</span>
                <span className="text-brand-primary text-base">₹{liveRecalculatedTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Confirm Collection & Payment */}
            <button
              onClick={handleConfirmCollectionAndPayment}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>💰 Confirm Collection & Payment</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">My Active Pickups</h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
            Follow the 5-step pickup workflow to travel, arrive, weigh scrap on physical scale, and pay customer
          </p>
        </div>

        {/* Active Pickups List */}
        {myActivePickups.length > 0 ? (
          <div className="space-y-4">
            {myActivePickups.map((req) => {
              const currentStatus = req.status;

              return (
                <div
                  key={req.id}
                  className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-brand-text">Request #{req.id}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                          {currentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-secondary mt-0.5">
                        Customer: <strong className="text-brand-text">{req.userName}</strong> (+91 {req.userPhone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-brand-text-secondary block font-semibold">
                        {currentStatus === 'Accepted' || currentStatus === 'On the Way'
                          ? 'Est. Payout (Subject to Scale)'
                          : 'Final Scale Payout'}
                      </span>
                      <span className="text-xl font-extrabold text-brand-primary">
                        ₹{req.estimatedValue}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Progress Indicator strictly matching pickup state */}
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                    {[
                      { status: 'Accepted', label: '1. Accepted' },
                      { status: 'On the Way', label: '2. On the Way' },
                      { status: 'Arrived', label: '3. Arrived' },
                      { status: 'Scrap Collected', label: '4. Weigh & Collect' },
                      { status: 'Completed', label: '5. Completed' },
                    ].map((step) => {
                      const statusOrder = ['Accepted', 'Collector Confirmed', 'On the Way', 'Arrived', 'Scrap Collected', 'Completed'];
                      const currentIdx = statusOrder.indexOf(currentStatus);
                      const stepIdx = statusOrder.indexOf(step.status);
                      const isCurrent = currentStatus === step.status || (currentStatus === 'Collector Confirmed' && step.status === 'Accepted');
                      const isReached = currentIdx >= stepIdx;

                      return (
                        <div
                          key={step.status}
                          className={`py-2 px-1 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-brand-primary text-white font-extrabold ring-2 ring-brand-primary/30 shadow-xs'
                              : isReached
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : 'bg-brand-bg text-brand-text-secondary'
                          }`}
                        >
                          {step.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Information Box based on Current Pickup State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-bg/60 p-4 rounded-2xl border border-brand-border text-xs">
                    <div>
                      <span className="text-brand-text-secondary block font-bold">📍 Pickup Location:</span>
                      <span className="font-semibold text-brand-text">{req.pickupAddress}</span>
                    </div>

                    <div>
                      <span className="text-brand-text-secondary block font-bold">
                        {currentStatus === 'Accepted' || currentStatus === 'On the Way'
                          ? '📋 Customer Estimated Scrap:'
                          : '⚖️ Measured Scale Scrap:'}
                      </span>
                      <div className="font-semibold text-brand-text mt-0.5 space-y-0.5">
                        {req.items.map((i) => (
                          <div key={i.id} className="flex justify-between text-[11px]">
                            <span>• {i.name} ({i.category})</span>
                            <span className="font-bold">{i.weightKg} kg (Est ₹{i.amount})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Banner Messages */}
                  {(currentStatus === 'Accepted' || currentStatus === 'Collector Confirmed') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 font-medium">
                      ℹ️ Order accepted. Review customer address above and start pickup when traveling. Scale weighing is unlocked after arrival.
                    </div>
                  )}

                  {currentStatus === 'On the Way' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-medium flex items-center gap-2">
                      <span className="animate-pulse text-base">🚗</span>
                      <span>Collector is traveling to customer address. Click "Mark Arrived" upon reaching doorstep.</span>
                    </div>
                  )}

                  {currentStatus === 'Arrived' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-medium flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span>Arrived at customer address! Click "Start Weighing" to inspect scrap and enter physical scale weights.</span>
                    </div>
                  )}

                  {/* Action Buttons strictly matched to current state */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
                    
                    {/* 1. Accepted State -> Start Pickup */}
                    {(currentStatus === 'Accepted' || currentStatus === 'Collector Confirmed') && (
                      <button
                        onClick={() => handleStatusAdvance(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                      >
                        🚗 Start Pickup
                      </button>
                    )}

                    {/* 2. On the Way State -> Mark Arrived */}
                    {currentStatus === 'On the Way' && (
                      <button
                        onClick={() => handleStatusAdvance(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                      >
                        📍 Mark Arrived
                      </button>
                    )}

                    {/* 3. Arrived State -> Start Weighing */}
                    {currentStatus === 'Arrived' && (
                      <button
                        onClick={() => handleOpenWeighingModal(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-md cursor-pointer"
                      >
                        ⚖️ Start Weighing
                      </button>
                    )}

                    {/* 4. Scrap Collected State -> Complete & Pay */}
                    {currentStatus === 'Scrap Collected' && (
                      <button
                        onClick={() => handleOpenWeighingModal(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 transition shadow-md cursor-pointer"
                      >
                        💰 Confirm Collection & Payment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mx-auto text-xl">
              🚚
            </div>
            <h3 className="font-bold text-brand-text text-base">No active pickups in progress</h3>
            <p className="text-brand-text-secondary text-xs">Accept a new order from Pickup Requests to start collecting.</p>
          </div>
        )}

        {/* Completed History List */}
        {myCompletedPickups.length > 0 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-brand-text border-b border-brand-border pb-3">
              ✓ Completed Pickups ({myCompletedPickups.length})
            </h3>
            <div className="space-y-2">
              {myCompletedPickups.map((c) => (
                <div key={c.id} className="flex justify-between items-center text-xs p-3 bg-brand-bg rounded-xl border border-brand-border/60">
                  <div>
                    <span className="font-bold text-brand-text">#{c.id} — {c.userName}</span>
                    <p className="text-brand-text-secondary text-[11px]">{c.items.map((i) => `${i.name} (${i.weightKg}kg)`).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-primary">Paid ₹{c.estimatedValue}</span>
                    <span className="block text-[10px] text-emerald-700 font-bold">{c.completedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
