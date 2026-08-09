import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth, type PickupRequest } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, pickups } = useAuth();
  const { selectedCity } = useCity();
  const [trackingModalPickup, setTrackingModalPickup] = useState<PickupRequest | null>(null);

  const userName = user?.name || 'Shubham Sutar';

  // Compute Statistics from real user pickups (filtered to current user only)
  const userPickups = pickups.filter((p) => p.userId === user?.userId);
  const pendingPickups = userPickups.filter((p) => p.status === 'Pending Pickup');
  const activePickups = userPickups.filter(
    (p) =>
      p.status === 'Accepted' ||
      p.status === 'Collector Confirmed' ||
      p.status === 'On the Way' ||
      p.status === 'Arrived' ||
      p.status === 'Scrap Collected'
  );
  const completedPickups = userPickups.filter((p) => p.status === 'Completed');

  const upcomingPickup = activePickups[0] || pendingPickups[0];

  const totalEarned = completedPickups.reduce((acc, p) => acc + p.estimatedValue, 0);
  // totalScrapSoldKg not displayed but kept for future use
  completedPickups.reduce(
    (acc, p) => acc + p.items.reduce((sum, item) => sum + item.weightKg, 0),
    0
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between font-sans">
      <Navbar />
      <AuthModal />

      {/* Track Pickup Modal */}
      {trackingModalPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setTrackingModalPickup(null)} />
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-5 shadow-2xl relative animate-[slideUp_200ms_ease-out]">
            <button
              onClick={() => setTrackingModalPickup(null)}
              className="absolute top-5 right-5 text-brand-text-secondary hover:text-brand-text p-1 text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                Live Order Tracker
              </span>
              <h3 className="text-xl font-extrabold text-brand-text mt-1">
                Pickup Request #{trackingModalPickup.id}
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Assigned Collector: <strong className="text-brand-text">{trackingModalPickup.collectorName || 'Raj Scrap Center'}</strong>
              </p>
            </div>

            {/* Stepper Display */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
              {[
                { status: 'Accepted', label: 'Accepted' },
                { status: 'On the Way', label: 'On the Way' },
                { status: 'Arrived', label: 'Arrived' },
                { status: 'Scrap Collected', label: 'Weighing' },
                { status: 'Completed', label: 'Completed' },
              ].map((step) => {
                const statusOrder = ['Accepted', 'Collector Confirmed', 'On the Way', 'Arrived', 'Scrap Collected', 'Completed'];
                const currentIdx = statusOrder.indexOf(trackingModalPickup.status);
                const stepIdx = statusOrder.indexOf(step.status);
                const isReached = currentIdx >= stepIdx;

                return (
                  <div
                    key={step.status}
                    className={`py-2 px-1 rounded-xl transition-all ${
                      isReached ? 'bg-brand-primary text-white font-bold' : 'bg-brand-bg text-brand-text-secondary'
                    }`}
                  >
                    {isReached ? '● ' : '○ '}{step.label}
                  </div>
                );
              })}
            </div>

            {/* Items Breakdown */}
            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border space-y-2 text-xs">
              <span className="font-bold text-brand-text block uppercase text-[10px] tracking-wider">
                Scrap Items & Estimated Value:
              </span>
              {trackingModalPickup.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>{i.name} ({i.weightKg} kg)</span>
                  <span className="font-bold">₹{i.amount}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-brand-border text-brand-primary">
                <span>Total Amount:</span>
                <span>₹{trackingModalPickup.estimatedValue}</span>
              </div>
            </div>

            <button
              onClick={() => setTrackingModalPickup(null)}
              className="w-full py-3 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-dark transition cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-brand-text-secondary text-sm sm:text-base font-medium">
            Track active doorstep scrap pickups and sell recyclable waste in {selectedCity}.
          </p>
        </div>

        {/* 2. Main Primary Hero Card */}
        <div className="bg-gradient-to-r from-brand-dark to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-lg z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-md">
              ✦ AI-Powered Scrap Selling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Sell Your Scrap ♻️
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Upload a photo and let ScrapNow AI identify your recyclable materials and broadcast to registered collectors in {selectedCity}.
            </p>
          </div>

          <button
            onClick={() => navigate('/sell-scrap')}
            className="z-10 py-3.5 px-7 rounded-2xl bg-brand-primary hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-md hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            Start Selling →
          </button>
        </div>

        {/* 3. Activity Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Pending Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {pendingPickups.length}
            </div>
            <span className="text-[11px] text-brand-primary font-semibold">Broadcasting to collectors</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Active Pickup
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              {activePickups.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Assigned & in progress</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Completed Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {completedPickups.length}
            </div>
            <span className="text-[11px] text-brand-text-secondary font-medium">Successful sales</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Recent Transactions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              ₹{totalEarned}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Cash payouts received</span>
          </div>
        </div>

        {/* 4. Active Pickup & Live Location Section */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div>
              <h3 className="text-xl font-bold text-brand-text">Active Doorstep Pickup</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Real-time tracking of your current scrap collection request
              </p>
            </div>
            {upcomingPickup && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                {upcomingPickup.status}
              </span>
            )}
          </div>

          {upcomingPickup ? (
            <div className="space-y-6">
              {/* Pickup Header Card */}
              <div className="bg-brand-bg/80 border border-brand-border rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
                  <div>
                    <span className="text-xs font-bold text-brand-text-secondary">Request #{upcomingPickup.id}</span>
                    <h4 className="text-lg font-extrabold text-brand-text mt-0.5">
                      Collector: {upcomingPickup.collectorName || 'Auto-assigning nearby collector...'}
                    </h4>
                    <p className="text-xs text-brand-text-secondary">📍 {upcomingPickup.pickupAddress}</p>
                  </div>

                  <button
                    onClick={() => setTrackingModalPickup(upcomingPickup)}
                    className="py-2.5 px-5 rounded-xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-dark transition shadow-2xs cursor-pointer self-start sm:self-auto"
                  >
                    Track Pickup →
                  </button>
                </div>

                {/* 5-Step Progress Stepper */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {[
                    { status: 'Accepted', label: 'Accepted' },
                    { status: 'On the Way', label: 'On the Way' },
                    { status: 'Arrived', label: 'Arrived' },
                    { status: 'Scrap Collected', label: 'Weighing' },
                    { status: 'Completed', label: 'Completed' },
                  ].map((step) => {
                    const statusOrder = ['Accepted', 'Collector Confirmed', 'On the Way', 'Arrived', 'Scrap Collected', 'Completed'];
                    const currentIdx = statusOrder.indexOf(upcomingPickup.status);
                    const stepIdx = statusOrder.indexOf(step.status);
                    const isReached = currentIdx >= stepIdx;

                    return (
                      <div
                        key={step.status}
                        className={`py-2 px-1 rounded-xl transition-all ${
                          isReached
                            ? 'bg-brand-primary text-white font-extrabold shadow-2xs'
                            : 'bg-white text-brand-text-secondary border border-brand-border'
                        }`}
                      >
                        {isReached ? '● ' : '○ '}{step.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Live Geolocation Map Component when Collector is On the Way */}
              {upcomingPickup.status === 'On the Way' && (
                <div className="bg-gradient-to-br from-emerald-900 to-brand-dark rounded-2xl p-6 text-white space-y-4 shadow-md border border-emerald-700 animate-[fadeIn_200ms_ease-out]">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base">Collector is On The Way</h4>
                        <p className="text-[11px] text-emerald-200">
                          Estimated Arrival: <strong>~15 mins</strong> (within {upcomingPickup.timeSlot} window)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">
                      Approx. distance: 2.4 km away
                    </span>
                  </div>

                  {/* Visual Location Map Graphic */}
                  <div className="bg-emerald-950/80 rounded-xl p-5 border border-emerald-600/40 relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <div>
                          <span className="block text-[10px] text-emerald-300 font-bold uppercase">Your Location</span>
                          <span className="text-white font-bold">{upcomingPickup.pickupAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <span className="block text-[10px] text-emerald-300 font-bold uppercase">Collector Position</span>
                          <span className="text-white font-bold">{upcomingPickup.collectorName || 'Ashok Scrap Traders'}</span>
                        </div>
                        <span className="text-2xl">🚚</span>
                      </div>
                    </div>

                    <div className="relative h-2 bg-emerald-800 rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-brand-primary w-2/3 animate-pulse rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 bg-brand-bg/50 rounded-2xl border border-brand-border">
              <div className="w-12 h-12 bg-white text-brand-text-secondary rounded-full flex items-center justify-center mx-auto text-xl shadow-2xs">
                🚚
              </div>
              <div>
                <h4 className="font-bold text-brand-text text-sm">No active pickups right now</h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">Submit your scrap images to get doorstep collection.</p>
              </div>
              <button
                onClick={() => navigate('/sell-scrap')}
                className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition cursor-pointer"
              >
                Sell Scrap →
              </button>
            </div>
          )}
        </div>

        {/* 6. Recent Transactions */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-lg font-bold text-brand-text">Recent Transactions</h3>
            {completedPickups.length > 0 && (
              <button
                onClick={() => navigate('/my-sales')}
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                View History →
              </button>
            )}
          </div>

          {completedPickups.length > 0 ? (
            <div className="space-y-3">
              {completedPickups.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-brand-border bg-white"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl shadow-2xs">
                      ♻️
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm sm:text-base">
                        {p.items.map((i) => i.name).join(', ')}
                      </h4>
                      <p className="text-xs text-brand-text-secondary mt-0.5">
                        {p.items.reduce((sum, i) => sum + i.weightKg, 0)} kg • Completed on {p.completedAt || 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-brand-primary font-extrabold text-base block">
                      +₹{p.estimatedValue}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Paid via {p.paymentMethod || 'Cash'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-brand-bg text-brand-text-secondary rounded-full flex items-center justify-center mx-auto text-xl">
                📋
              </div>
              <p className="text-xs text-brand-text-secondary">Your completed scrap sales and cash payouts will appear here.</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
