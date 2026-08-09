import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import { useAuth, type PickupRequest } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function CollectorPickupRequests() {
  const navigate = useNavigate();
  const { user, pickups, acceptPickupRequest, rejectPickupRequest } = useAuth();
  const { selectedCity } = useCity();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState<PickupRequest | null>(null);

  const collectorId = user?.collectorProfile?.collectorId || user?.userId || 'COL-901';
  const collectorName = user?.businessName || user?.name || 'Ashok Scrap Traders';
  const collectorPhone = user?.phone || '9822000000';

  // Only display Pending requests matching current city
  const availableRequests = pickups.filter((p) => p.status === 'Pending Pickup');

  const handleAccept = (req: PickupRequest) => {
    acceptPickupRequest(req.id, {
      id: collectorId,
      name: collectorName,
      phone: collectorPhone,
    });
    setToastMessage(`✓ Accepted Pickup Request #${req.id}! Assigned to ${collectorName}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReject = (req: PickupRequest) => {
    rejectPickupRequest(req.id);
    setToastMessage(`Request #${req.id} rejected.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <CollectorNavbar />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-[slideDown_200ms_ease-out]">
          {toastMessage}
        </div>
      )}

      {/* Details Modal */}
      {selectedDetailsRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedDetailsRequest(null)} />
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedDetailsRequest(null)}
              className="absolute top-5 right-5 text-brand-text-secondary hover:text-brand-text p-1 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-brand-text">Pickup Request #{selectedDetailsRequest.id}</h3>
            
            <div className="space-y-2 text-xs sm:text-sm border-y border-brand-border py-3">
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Customer:</span>
                <span className="font-bold text-brand-text">{selectedDetailsRequest.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Phone:</span>
                <span className="font-bold text-brand-primary">+91 {selectedDetailsRequest.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Pickup Location:</span>
                <span className="font-semibold text-brand-text text-right max-w-[200px]">{selectedDetailsRequest.pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary">Preferred Time:</span>
                <span className="font-semibold text-brand-text">{selectedDetailsRequest.timeSlot}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider block">Items & Quantities</span>
              {selectedDetailsRequest.items.map((i) => (
                <div key={i.id} className="flex justify-between text-xs bg-brand-bg p-2 rounded-xl">
                  <span>{i.name} ({i.category})</span>
                  <span className="font-bold">{i.weightKg} kg • ₹{i.amount}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleAccept(selectedDetailsRequest);
                  setSelectedDetailsRequest(null);
                }}
                className="w-full py-3 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-dark transition cursor-pointer"
              >
                Accept Order as {collectorName}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">New Pickup Requests</h1>
            <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
              Doorstep scrap collection requests submitted by customers in {selectedCity}
            </p>
          </div>
          <button
            onClick={() => navigate('/collector/my-pickups')}
            className="py-2.5 px-4 bg-brand-light text-brand-dark font-bold text-xs rounded-xl border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition"
          >
            My Active Pickups →
          </button>
        </div>

        {availableRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableRequests.map((req) => {
              const categoriesText = req.items.map((i) => i.name).join(', ');
              const totalWeight = req.items.reduce((sum, i) => sum + i.weightKg, 0);

              return (
                <div
                  key={req.id}
                  className="bg-brand-card border border-brand-border hover:border-brand-primary rounded-2xl p-5 shadow-2xs space-y-4 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-brand-border/60 pb-2.5">
                      <span className="text-xs font-extrabold text-brand-text">Request #{req.id}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                        PENDING
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-brand-text-secondary">
                      <p className="font-bold text-brand-text text-sm flex items-center gap-1">
                        <span>👤</span> {req.userName}
                      </p>
                      <p className="font-semibold text-brand-text flex items-center gap-1">
                        <span>📍</span> {req.pickupAddress}
                      </p>
                      <p className="flex items-center gap-1.5 font-medium text-brand-text">
                        <span>♻️</span> {categoriesText} (~{totalWeight} kg)
                      </p>
                      <div className="pt-1 text-xs">
                        <span className="text-brand-text-secondary block">Estimated Value:</span>
                        <span className="font-extrabold text-brand-primary text-base">
                          ₹{req.estimatedValue}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-brand-text-secondary">
                        🕐 {req.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-brand-border/60">
                    <button
                      onClick={() => setSelectedDetailsRequest(req)}
                      className="px-3 py-2 rounded-xl border border-brand-border text-brand-text font-bold text-xs hover:bg-brand-bg transition cursor-pointer"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleAccept(req)}
                      className="flex-1 py-2 rounded-xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-dark transition shadow-2xs cursor-pointer"
                    >
                      Accept Pickup
                    </button>

                    <button
                      onClick={() => handleReject(req)}
                      className="px-2.5 py-2 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mx-auto text-xl">
              ✅
            </div>
            <h3 className="font-bold text-brand-text text-base">No pending pickup requests</h3>
            <p className="text-brand-text-secondary text-xs">You have reviewed or accepted all available scrap orders in {selectedCity}.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
