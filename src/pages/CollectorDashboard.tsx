import { useState } from 'react';
import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import { useAuth, type PickupRequest } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function CollectorDashboard() {
  const { user, pickups, acceptPickupRequest } = useAuth();
  const { selectedCity } = useCity();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const collectorName = user?.businessName || user?.name || 'Partner Collector';

  // Determine Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Pending Requests available for accepting
  const newRequests = pickups.filter((p) => p.status === 'Pending Pickup');
  const myConfirmedPickups = pickups.filter(
    (p) => p.status === 'Collector Confirmed' || p.status === 'In Progress'
  );
  const completedPickups = pickups.filter((p) => p.status === 'Completed');
  const todayEarnings = completedPickups.reduce((acc, p) => acc + p.estimatedValue, 1850);

  const handleAccept = (req: PickupRequest) => {
    acceptPickupRequest(req.id, collectorName);
    setToastMessage(`✓ Pickup Request ${req.id} Accepted Successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <CollectorNavbar />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-[slideDown_200ms_ease-out] flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            {greeting}, {collectorName} 👋
          </h1>
          <p className="text-brand-text-secondary text-sm sm:text-base font-medium">
            Manage your scrap pickups and grow your collection business in {selectedCity}.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              New Requests
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              {newRequests.length}
            </div>
            <span className="text-[11px] text-brand-text-secondary font-medium">Available near you</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Today's Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {myConfirmedPickups.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Scheduled & confirmed</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Completed Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {completedPickups.length + 14}
            </div>
            <span className="text-[11px] text-brand-text-secondary font-medium">This month</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Today's Earnings
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              ₹{todayEarnings}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Payouts collected</span>
          </div>
        </div>

        {/* 📍 Nearby Pickup Requests */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div>
              <h3 className="text-xl font-bold text-brand-text">📍 Nearby Pickup Requests</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                New doorstep scrap collection orders from customers in {selectedCity}
              </p>
            </div>
            <span className="px-3 py-1 bg-brand-light text-brand-dark text-xs font-extrabold rounded-full border border-brand-primary/20">
              {newRequests.length} Requests Available
            </span>
          </div>

          {newRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {newRequests.map((req) => {
                const categoriesText = req.items.map((i) => i.category).filter((v, i, a) => a.indexOf(v) === i).join(' + ');
                const totalWeight = req.items.reduce((sum, i) => sum + i.weightKg, 0);

                return (
                  <div
                    key={req.id}
                    className="bg-brand-card border border-brand-border hover:border-brand-primary rounded-2xl p-5 shadow-2xs space-y-4 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-brand-border/60 pb-2.5">
                        <span className="text-xs font-extrabold text-brand-text">
                          Pickup Request #{req.id}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>

                      {/* Request Details */}
                      <div className="space-y-1.5 text-xs text-brand-text-secondary">
                        <p className="font-bold text-brand-text text-sm flex items-center gap-1">
                          <span>📍</span> {req.pickupAddress}
                        </p>
                        <p className="flex items-center gap-1.5 font-semibold text-brand-text">
                          <span>♻️</span> {categoriesText}
                        </p>
                        <div className="flex items-center gap-4 pt-1 text-xs">
                          <span className="font-semibold">⚖️ ~{totalWeight} kg</span>
                          <span className="font-extrabold text-brand-primary text-sm">
                            💰 Estimated ₹{req.estimatedValue}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-brand-text-secondary">
                          🕐 {req.timeSlot}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-brand-border/60">
                      <button
                        onClick={() => alert(`Customer Details:\nName: ${req.userName}\nPhone: +91 ${req.userPhone}\nAddress: ${req.pickupAddress}`)}
                        className="flex-1 py-2.5 rounded-xl border border-brand-border text-brand-text font-bold text-xs hover:bg-brand-bg transition cursor-pointer"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => handleAccept(req)}
                        className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                      >
                        Accept Pickup
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 bg-brand-bg/50 rounded-2xl border border-brand-border">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-xl shadow-2xs">
                🚚
              </div>
              <h4 className="font-bold text-brand-text text-sm">No new requests pending</h4>
              <p className="text-xs text-brand-text-secondary">All nearby scrap collection requests in {selectedCity} have been accepted.</p>
            </div>
          )}
        </div>

        {/* Active Accepted Pickups Section */}
        {myConfirmedPickups.length > 0 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-brand-text border-b border-brand-border pb-3">
              📋 My Active Confirmed Pickups
            </h3>

            <div className="space-y-3">
              {myConfirmedPickups.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-brand-border bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-text text-sm">ID: {p.id}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-text mt-0.5">
                      Customer: {p.userName} (+91 {p.userPhone}) • {p.pickupAddress}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-brand-primary text-base block">
                      ₹{p.estimatedValue}
                    </span>
                    <span className="text-[11px] text-brand-text-secondary">Slot: {p.timeSlot}</span>
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
