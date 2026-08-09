import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function MySales() {
  const navigate = useNavigate();
  const { pickups } = useAuth();
  const completedSales = pickups.filter((p) => p.status === 'Completed');

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">My Scrap Sales</h1>
            <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
              History of completed scrap transactions and payments received
            </p>
          </div>
          <button
            onClick={() => navigate('/sell-scrap')}
            className="py-2.5 px-5 bg-brand-primary text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-brand-dark transition shadow-xs cursor-pointer"
          >
            Sell Scrap →
          </button>
        </div>

        {completedSales.length > 0 ? (
          <div className="space-y-4">
            {completedSales.map((sale) => (
              <div key={sale.id} className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-brand-text">ID: {sale.id}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      ✓ Completed
                    </span>
                  </div>
                  <h4 className="font-bold text-brand-text text-sm sm:text-base">
                    {sale.items.map((i) => `${i.name} (${i.weightKg} kg)`).join(', ')}
                  </h4>
                  <p className="text-xs text-brand-text-secondary">
                    Collector: {sale.collectorName} • Completed on {sale.completedAt || 'Recently'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-extrabold text-brand-primary block">
                    +₹{sale.estimatedValue}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Paid via {sale.paymentMethod || 'UPI'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-brand-bg rounded-full flex items-center justify-center mx-auto text-2xl">
              💰
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-base">No completed sales yet</h3>
              <p className="text-brand-text-secondary text-xs mt-1">Once a collector completes your pickup, earnings appear here.</p>
            </div>
            <button
              onClick={() => navigate('/sell-scrap')}
              className="py-2.5 px-6 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-dark transition"
            >
              Start Selling Scrap
            </button>
          </div>
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
