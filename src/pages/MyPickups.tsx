import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function MyPickups() {
  const navigate = useNavigate();
  const { pickups } = useAuth();
  const { selectedCity } = useCity();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

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
          {pickups.map((p) => (
            <div key={p.id} className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-brand-text">ID: {p.id}</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full ${
                    p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-light text-brand-dark'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <span className="text-xs text-brand-text-secondary font-medium">
                  {p.timeSlot}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-brand-text-secondary block">Collector:</span>
                  <span className="font-bold text-brand-text">{p.collectorName} ({p.collectorRating} ⭐)</span>
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
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
