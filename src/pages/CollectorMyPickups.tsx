import { useState } from 'react';
import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import {
  useAuth,
  type PickupRequest,
  type PickupItem,
} from '../context/AuthContext';

export default function CollectorMyPickups() {
  const { pickups, updatePickupStatus, updatePickupItems, updateCollectorLocation } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeWatchId, setActiveWatchId] = useState<number | null>(null);
  const [sharingReqId, setSharingReqId] = useState<string | null>(null);

  // Toggle Geolocation Sharing for an active pickup on the way
  const toggleLocationSharing = (req: PickupRequest) => {
    if (sharingReqId === req.id) {
      if (activeWatchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(activeWatchId);
      }
      setActiveWatchId(null);
      setSharingReqId(null);
      updateCollectorLocation(req.id, 18.5074, 73.8077, false);
      setToastMessage('Live location sharing disabled.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    setSharingReqId(req.id);
    setToastMessage('📡 Live location sharing activated for customer tracking!');
    setTimeout(() => setToastMessage(null), 3000);

    // Initial update with default Kothrud Pune coordinates
    updateCollectorLocation(req.id, 18.5074, 73.8077, true);

    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          updateCollectorLocation(req.id, pos.coords.latitude, pos.coords.longitude, true);
        },
        (err) => {
          console.warn('Browser geolocation denied/unavailable, using simulation coords.', err);
          updateCollectorLocation(req.id, 18.5080, 73.8085, true);
        },
        { enableHighAccuracy: true }
      );
      setActiveWatchId(id);
    }
  };

  // Modal State for Scale Weighing
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

  // Handle status advances matching the 5-state lifecycle
  const handleStatusAdvance = (req: PickupRequest) => {
    if (req.status === 'Accepted' || req.status === 'Collector Confirmed') {
      updatePickupStatus(req.id, 'On the Way', 'Cash');
      setToastMessage(`🚗 Pickup #${req.id} started! Status: On the Way`);
    } else if (req.status === 'On the Way') {
      updatePickupStatus(req.id, 'Arrived', 'Cash');
      setToastMessage(`📍 Arrived at customer address for #${req.id}!`);
    } else if (req.status === 'Arrived') {
      // Transition status to 'Scrap Collected' (Weigh & Collect stage)
      updatePickupStatus(req.id, 'Scrap Collected', 'Cash');
      handleOpenWeighingModal({ ...req, status: 'Scrap Collected' });
      return;
    } else if (req.status === 'Scrap Collected') {
      handleOpenWeighingModal(req);
      return;
    }

    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Weighing & Scale Entry Modal
  const handleOpenWeighingModal = (req: PickupRequest) => {
    if (req.status !== 'Arrived' && req.status !== 'Scrap Collected') {
      alert('Physical scale weighing is only allowed after arriving at customer address.');
      return;
    }
    setWeighingRequest(req);
    setEditableItems(req.items.map((item) => ({ ...item })));
  };

  // Inline Card Item Weight/Price Change (preserves pickupStatus!)
  const handleInlineItemChange = (
    requestId: string,
    currentItems: PickupItem[],
    index: number,
    field: keyof PickupItem,
    value: string | number
  ) => {
    const updated = currentItems.map((item, idx) => {
      if (idx === index) {
        const copy = { ...item };
        if (field === 'weightKg' || field === 'pricePerKg') {
          const num = parseFloat(value as string);
          const safe = isNaN(num) || num < 0 ? 0 : num;
          (copy as any)[field] = safe;
          copy.amount = Math.round(copy.weightKg * copy.pricePerKg);
        } else {
          (copy as any)[field] = value;
        }
        return copy;
      }
      return item;
    });

    // Update items & recalculated value ONLY — pickupStatus remains unchanged!
    updatePickupItems(requestId, updated);
  };

  // Inline Delete Scrap Item (preserves pickupStatus!)
  const handleInlineDeleteItem = (requestId: string, currentItems: PickupItem[], index: number) => {
    if (currentItems.length <= 1) {
      alert('Please keep at least one scrap item in the list.');
      return;
    }
    const updated = currentItems.filter((_, idx) => idx !== index);
    // Update items & total ONLY — status remains 'Scrap Collected'!
    updatePickupItems(requestId, updated);
    setToastMessage(`Item removed. Total recalculated.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Inline Add Scrap Item
  const handleInlineAddItem = (requestId: string, currentItems: PickupItem[]) => {
    const newItem: PickupItem = {
      id: `item-${Date.now()}`,
      name: 'Cardboard Box',
      category: 'Paper',
      weightKg: 5,
      pricePerKg: 10,
      amount: 50,
    };
    updatePickupItems(requestId, [...currentItems, newItem]);
  };

  // Modal Item Field Change
  const handleModalItemFieldChange = (
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

  // Modal Add Item
  const handleModalAddItem = () => {
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

  // Modal Remove Item
  const handleModalRemoveItem = (index: number) => {
    if (editableItems.length <= 1) {
      alert('Please keep at least one scrap item in the list.');
      return;
    }
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Modal Corrections (preserves pickupStatus!)
  const handleSaveModalCorrections = () => {
    if (!weighingRequest) return;
    if (editableItems.length === 0) {
      alert('Please keep at least one scrap item.');
      return;
    }
    updatePickupItems(weighingRequest.id, editableItems);
    setToastMessage(`✓ Scale weights updated for #${weighingRequest.id}`);
    setWeighingRequest(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Final Action: Confirm Collection & Payment
  const handleFinalConfirmPayment = (req: PickupRequest) => {
    if (req.items.length === 0) {
      alert('Cannot complete pickup with 0 items.');
      return;
    }
    updatePickupStatus(req.id, 'Completed', 'Cash');
    setToastMessage(`🎉 Collection & Payment Confirmed for #${req.id}! Transaction created.`);
    if (weighingRequest?.id === req.id) setWeighingRequest(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const modalLiveTotal = editableItems.reduce(
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

      {/* 4. Weigh & Collect Modal */}
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
                Stage 4 — Weigh & Collect (Doorstep Physical Scale)
              </span>
              <h3 className="text-xl font-extrabold text-brand-text mt-1">
                Measured Scale Weights (#{weighingRequest.id})
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Enter scale weights. Editing or deleting items will NOT reset your pickup status.
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
                <span className="text-brand-text-secondary block font-semibold">Recalculated Payout:</span>
                <span className="font-extrabold text-brand-primary text-xl">₹{modalLiveTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Item Scale Inputs */}
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
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleModalItemFieldChange(idx, 'name', e.target.value)}
                        className="w-full p-2 text-xs font-bold text-brand-text border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary uppercase">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleModalItemFieldChange(idx, 'category', e.target.value)}
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
                          onChange={(e) => handleModalItemFieldChange(idx, 'weightKg', e.target.value)}
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
                          onChange={(e) => handleModalItemFieldChange(idx, 'pricePerKg', e.target.value)}
                          className="w-full p-2 text-xs font-bold text-brand-text border border-brand-border rounded-xl focus:outline-none"
                        />
                      </div>

                      {editableItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleModalRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold pt-4 px-1"
                          title="Delete Item"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs pt-1 border-t border-brand-border/40 font-mono">
                    <span className="text-brand-text-secondary">{item.name}: </span>
                    <span className="font-bold text-brand-text">{item.weightKg} kg × ₹{item.pricePerKg} = </span>
                    <span className="font-extrabold text-brand-primary">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleModalAddItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-brand-primary text-brand-primary font-bold text-xs hover:bg-brand-light/50 transition cursor-pointer"
              >
                + Add Another Scrap Item
              </button>
            </div>

            {/* Total Itemized Formula Breakdown */}
            <div className="bg-brand-bg/80 p-3.5 rounded-2xl border border-brand-border space-y-1 text-xs">
              <div className="font-bold text-brand-text uppercase tracking-wider text-[11px] border-b pb-1">
                Itemized Breakdown
              </div>
              {editableItems.map((item, i) => (
                <div key={i} className="flex justify-between font-mono">
                  <span>{item.name}: {item.weightKg} kg × ₹{item.pricePerKg}</span>
                  <span className="font-bold text-brand-text">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-brand-border">
                <span>Total Cash Payout:</span>
                <span className="text-brand-primary text-base">₹{modalLiveTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-brand-border">
              <button
                onClick={handleSaveModalCorrections}
                className="w-full sm:flex-1 py-3 rounded-xl bg-brand-card border border-brand-border text-brand-text font-bold text-xs hover:bg-brand-bg transition cursor-pointer"
              >
                Save Scale Corrections
              </button>

              <button
                onClick={() => {
                  if (!weighingRequest) return;
                  updatePickupItems(weighingRequest.id, editableItems);
                  handleFinalConfirmPayment(weighingRequest);
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💰 Confirm Collection & Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">My Active Pickups</h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
            Manage active doorstep pickups. Editing or deleting items during Weigh & Collect will not reset pickup status.
          </p>
        </div>

        {/* Active Pickups List */}
        {myActivePickups.length > 0 ? (
          <div className="space-y-5">
            {myActivePickups.map((req) => {
              const currentStatus = req.status;
              const isWeighingStage = currentStatus === 'Scrap Collected';
              const cardTotalAmount = req.items.reduce((sum, item) => sum + item.pricePerKg * item.weightKg, 0);

              return (
                <div
                  key={req.id}
                  className={`bg-brand-card border rounded-3xl p-6 shadow-xs space-y-5 transition-all ${
                    isWeighingStage ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-brand-border'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-brand-text">Request #{req.id}</span>
                        <span
                          className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${
                            isWeighingStage ? 'bg-brand-primary text-white shadow-2xs' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isWeighingStage ? '4. Weigh & Collect (Active)' : currentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-secondary mt-0.5">
                        Customer: <strong className="text-brand-text">{req.userName}</strong> (+91 {req.userPhone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-brand-text-secondary block font-semibold">
                        {isWeighingStage ? 'Calculated Scale Payout' : 'Estimated Payout'}
                      </span>
                      <span className="text-2xl font-extrabold text-brand-primary">
                        ₹{cardTotalAmount.toFixed(0)}
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
                              ? 'bg-brand-primary text-white font-extrabold shadow-2xs scale-102'
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

                  {/* Pickup Information & Items Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-text">
                      <span>📍 Pickup Location: {req.pickupAddress}</span>
                    </div>

                    {/* ─── STAGE 4: WEIGH & COLLECT INLINE EDITING (Preserves Status!) ─── */}
                    {isWeighingStage ? (
                      <div className="bg-emerald-50/60 border border-brand-primary/30 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between border-b border-brand-primary/20 pb-2">
                          <span className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                            <span>⚖️ Doorstep Scale Weighing</span>
                            <span className="text-[10px] font-normal text-emerald-800">(Editing items preserves status)</span>
                          </span>
                          <button
                            onClick={() => handleInlineAddItem(req.id, req.items)}
                            className="text-xs font-bold text-brand-primary bg-white px-2.5 py-1 rounded-lg border border-brand-primary/30 hover:bg-brand-light transition cursor-pointer"
                          >
                            + Add Item
                          </button>
                        </div>

                        {/* Inline Item List for Weighing Stage */}
                        <div className="space-y-2.5">
                          {req.items.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="bg-white p-3 rounded-xl border border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs shadow-2xs"
                            >
                              {/* Item Name */}
                              <div className="flex-1 min-w-0">
                                <label className="block text-[9px] font-bold text-brand-text-secondary uppercase">Material</label>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) =>
                                    handleInlineItemChange(req.id, req.items, index, 'name', e.target.value)
                                  }
                                  className="w-full font-bold text-brand-text bg-transparent border-b border-brand-border focus:border-brand-primary focus:outline-none py-0.5"
                                />
                              </div>

                              {/* Category */}
                              <div className="w-28">
                                <label className="block text-[9px] font-bold text-brand-text-secondary uppercase">Category</label>
                                <select
                                  value={item.category}
                                  onChange={(e) =>
                                    handleInlineItemChange(req.id, req.items, index, 'category', e.target.value)
                                  }
                                  className="w-full font-semibold text-brand-text bg-brand-bg rounded-lg p-1 border border-brand-border focus:outline-none"
                                >
                                  <option value="Paper">Paper</option>
                                  <option value="Plastic">Plastic</option>
                                  <option value="Metal">Metal</option>
                                  <option value="E-waste">E-waste</option>
                                  <option value="Rubber">Rubber</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>

                              {/* Scale Weight */}
                              <div className="w-28">
                                <label className="block text-[9px] font-bold text-brand-text-secondary uppercase">Scale Weight (kg)</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={item.weightKg}
                                    onChange={(e) =>
                                      handleInlineItemChange(req.id, req.items, index, 'weightKg', e.target.value)
                                    }
                                    className="w-full font-extrabold text-brand-primary bg-brand-light/30 border border-brand-primary rounded-lg p-1 text-right focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Rate */}
                              <div className="w-20">
                                <label className="block text-[9px] font-bold text-brand-text-secondary uppercase">Rate (₹/kg)</label>
                                <input
                                  type="number"
                                  value={item.pricePerKg}
                                  onChange={(e) =>
                                    handleInlineItemChange(req.id, req.items, index, 'pricePerKg', e.target.value)
                                  }
                                  className="w-full font-bold text-brand-text bg-brand-bg border border-brand-border rounded-lg p-1 text-right focus:outline-none"
                                />
                              </div>

                              {/* Subtotal */}
                              <div className="text-right min-w-[75px]">
                                <span className="text-[9px] text-brand-text-secondary block font-bold">Subtotal</span>
                                <span className="font-extrabold text-brand-text text-sm">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                              </div>

                              {/* Delete Button */}
                              {req.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleInlineDeleteItem(req.id, req.items, index)}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer self-center"
                                  title="Delete Item"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Itemized Formula Breakdown Display as requested */}
                        <div className="bg-white p-3 rounded-xl border border-brand-border space-y-1 text-xs font-mono">
                          <div className="font-bold text-brand-text text-[11px] border-b pb-1 font-sans">
                            Itemized Formula Breakdown:
                          </div>
                          {req.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name}: {item.weightKg} kg × ₹{item.pricePerKg}</span>
                              <span className="font-bold text-brand-text">₹{(item.weightKg * item.pricePerKg).toFixed(0)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold font-sans text-sm pt-1.5 border-t border-brand-border text-brand-primary">
                            <span>Total Scale Payout:</span>
                            <span>₹{cardTotalAmount.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Non-Weighing Stage Summary Display */
                      <div className="bg-brand-bg/60 p-3.5 rounded-2xl border border-brand-border text-xs space-y-1">
                        <span className="text-brand-text-secondary block font-bold">📋 Customer Estimated Scrap Items:</span>
                        <div className="font-semibold text-brand-text space-y-0.5">
                          {req.items.map((i) => (
                            <div key={i.id} className="flex justify-between text-[11px]">
                              <span>• {i.name} ({i.category})</span>
                              <span className="font-bold">{i.weightKg} kg (Est ₹{i.amount})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Banner Guidance */}
                  {(currentStatus === 'Accepted' || currentStatus === 'Collector Confirmed') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 font-medium">
                      ℹ️ Order accepted. Review customer address above and start pickup when traveling. Scale weighing unlocks after arrival.
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
                      <span>Arrived at doorstep! Click "Start Weighing" to inspect scrap and enter physical scale weights.</span>
                    </div>
                  )}

                  {/* Action Buttons strictly matched to current state */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
                    
                    {/* 1. Accepted State -> Start Pickup */}
                    {(currentStatus === 'Accepted' || currentStatus === 'Collector Confirmed') && (
                      <button
                        onClick={() => handleStatusAdvance(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                      >
                        🚗 Start Pickup
                      </button>
                    )}

                    {/* 2. On the Way State -> Share Location & Mark Arrived */}
                    {currentStatus === 'On the Way' && (
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => toggleLocationSharing(req)}
                          className={`w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs transition border cursor-pointer ${
                            sharingReqId === req.id
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold animate-pulse'
                              : 'bg-brand-card border-brand-primary text-brand-primary hover:bg-brand-light'
                          }`}
                        >
                          {sharingReqId === req.id ? '🟢 Sharing Live Location...' : '📡 Share Live Location'}
                        </button>

                        <button
                          onClick={() => handleStatusAdvance(req)}
                          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                        >
                          📍 Mark Arrived
                        </button>
                      </div>
                    )}

                    {/* 3. Arrived State -> Start Weighing */}
                    {currentStatus === 'Arrived' && (
                      <button
                        onClick={() => handleStatusAdvance(req)}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-primary text-white font-extrabold text-xs sm:text-sm hover:bg-brand-dark transition shadow-md cursor-pointer"
                      >
                        ⚖️ Start Weighing
                      </button>
                    )}

                    {/* 4. Weigh & Collect Stage -> Confirm Collection & Payment */}
                    {isWeighingStage && (
                      <button
                        onClick={() => handleFinalConfirmPayment(req)}
                        className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>💰 Confirm Collection & Payment</span>
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
