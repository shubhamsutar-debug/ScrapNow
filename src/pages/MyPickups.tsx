import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth, type PickupRequest } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function MyPickups() {
  const navigate = useNavigate();
  const { user, pickups, cancelPickupRequest } = useAuth();
  const { selectedCity } = useCity();

  const [cancelModalPickup, setCancelModalPickup] = useState<PickupRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show all pickups for the user
  const userPickups = pickups.filter(
    (p) => p.userId === user?.userId || p.userId === 'demo-user-1' || p.userId === 'guest-user'
  );

  const handleCustomerCancel = (req: PickupRequest) => {
    if (req.status === 'Pending Pickup') {
      const success = cancelPickupRequest(req.id, 'Customer cancelled pending request');
      if (success) {
        setToastMessage(`✓ Pickup Request #${req.id} cancelled.`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } else if (req.status === 'Accepted' || req.status === 'Collector Confirmed') {
      setCancelModalPickup(req);
    }
  };

  const handleConfirmCancelModal = () => {
    if (!cancelModalPickup) return;
    const success = cancelPickupRequest(
      cancelModalPickup.id,
      `Cancelled by customer after ${cancelModalPickup.collectorName || 'collector'} accepted`
    );

    if (success) {
      setToastMessage(`✓ Pickup Request #${cancelModalPickup.id} has been cancelled.`);
      setCancelModalPickup(null);
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      alert('Cannot cancel pickup. The collector is already on the way.');
      setCancelModalPickup(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between font-sans">
      <Navbar />
      <AuthModal />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-[slideDown_200ms_ease-out]">
          {toastMessage}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCancelModalPickup(null)} />
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 space-y-4 shadow-2xl relative animate-[slideUp_200ms_ease-out]">
            <button
              onClick={() => setCancelModalPickup(null)}
              className="absolute top-5 right-5 text-brand-text-secondary hover:text-brand-text p-1 text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full">
                Cancellation Warning
              </span>
              <h3 className="text-xl font-extrabold text-brand-text mt-1">Cancel Pickup Request?</h3>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <p className="font-semibold leading-relaxed">
                The collector <strong className="text-brand-text">{cancelModalPickup.collectorName}</strong> has already accepted your request.
              </p>
              <p className="text-[11px] text-amber-800">
                Are you sure you want to cancel this scheduled pickup?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setCancelModalPickup(null)}
                className="w-1/2 py-3 bg-brand-card border border-brand-border font-bold text-xs rounded-xl hover:bg-brand-bg transition cursor-pointer"
              >
                Keep Pickup
              </button>

              <button
                onClick={handleConfirmCancelModal}
                className="w-1/2 py-3 bg-red-600 text-white font-extrabold text-xs rounded-xl hover:bg-red-700 transition shadow-xs cursor-pointer"
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">My Pickups</h1>
            <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
              Track and manage doorstep scrap pickup requests in {selectedCity}
            </p>
          </div>
          <button
            onClick={() => navigate('/sell-scrap')}
            className="py-2.5 px-5 bg-brand-primary text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-brand-dark transition shadow-xs cursor-pointer"
          >
            + New Pickup
          </button>
        </div>

        <div className="space-y-4">
          {userPickups.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-bg rounded-full flex items-center justify-center mx-auto text-2xl">🚚</div>
              <div>
                <h3 className="font-bold text-brand-text text-base">No pickups yet</h3>
                <p className="text-brand-text-secondary text-xs mt-1">Submit your scrap to get a doorstep collection started.</p>
              </div>
              <button onClick={() => navigate('/sell-scrap')} className="py-2.5 px-6 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-dark transition cursor-pointer">
                Sell Scrap →
              </button>
            </div>
          ) : (
            userPickups.map((p) => (
              <div key={p.id} className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-brand-text">ID: {p.id}</span>
                    <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Cancelled by Customer' || p.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-brand-light text-brand-dark'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <span className="text-xs text-brand-text-secondary font-medium">
                    🕒 {p.timeSlot}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-brand-text-secondary block">Collector:</span>
                    <span className="font-bold text-brand-text">
                      {p.collectorName || 'Not assigned yet'}
                      {p.collectorRating ? ` (${p.collectorRating} ⭐)` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-text-secondary block">Estimated Value:</span>
                    <span className="font-extrabold text-brand-primary">₹{p.estimatedValue}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-brand-text-secondary block">Pickup Address:</span>
                    <span className="font-semibold text-brand-text">{p.pickupAddress}</span>
                  </div>
                </div>

                <div className="bg-brand-bg/60 p-3 rounded-xl border border-brand-border space-y-1">
                  <span className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider block">
                    Items to Pick Up:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {p.items.map((item) => (
                      <span key={item.id} className="bg-white border border-brand-border px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-text">
                        {item.name} ({item.weightKg} kg @ ₹{item.pricePerKg}/kg)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
                  {(p.status === 'Pending Pickup' ||
                    p.status === 'Accepted' ||
                    p.status === 'Collector Confirmed') ? (
                    <button
                      onClick={() => handleCustomerCancel(p)}
                      className="py-2 px-4 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  ) : p.status === 'On the Way' ? (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      🔒 Collector is en route. Cancellation is locked.
                    </span>
                  ) : (
                    <span className="text-xs text-brand-text-secondary font-medium">
                      Status: {p.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
