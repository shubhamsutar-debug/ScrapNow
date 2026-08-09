import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, pickups } = useAuth();
  const { selectedCity } = useCity();

  // If user is null (e.g. directly navigating), handle gracefully
  const userName = user?.name || 'Customer';

  // Determine Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Compute Statistics from real user pickups
  const pendingPickups = pickups.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled');
  const completedPickups = pickups.filter((p) => p.status === 'Completed');
  const upcomingPickup = pendingPickups[0]; // Active upcoming pickup

  const totalEarned = completedPickups.reduce((acc, p) => acc + p.estimatedValue, 0);
  const totalScrapSoldKg = completedPickups.reduce(
    (acc, p) => acc + p.items.reduce((sum, item) => sum + item.weightKg, 0),
    0
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-brand-text-secondary text-sm sm:text-base font-medium">
            Ready to turn your scrap into cash?
          </p>
        </div>

        {/* 2. Main Primary Hero Card */}
        <div className="bg-gradient-to-r from-brand-dark to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-lg z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-md">
              ✦ AI-Powered Scrap Selling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Sell Your Scrap ♻️
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Upload a photo and let ScrapNow AI identify your recyclable materials and generate instant market price estimates.
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
            <span className="text-[11px] text-brand-primary font-semibold">Active requests</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Completed Pickups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {completedPickups.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Successful sales</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Total Earned
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              ₹{totalEarned}
            </div>
            <span className="text-[11px] text-brand-text-secondary font-semibold">Payouts received</span>
          </div>

          <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Scrap Sold
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {totalScrapSoldKg} <span className="text-sm font-normal text-brand-text-secondary">kg</span>
            </div>
            <span className="text-[11px] text-brand-primary font-semibold">Recycled waste</span>
          </div>
        </div>

        {/* 4. Upcoming Pickup Section */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-lg font-bold text-brand-text">Upcoming Pickup</h3>
            {upcomingPickup && (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                {upcomingPickup.status}
              </span>
            )}
          </div>

          {upcomingPickup ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-bg/60 p-4 rounded-2xl border border-brand-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-brand-text text-base">{upcomingPickup.collectorName}</h4>
                  <span className="text-emerald-700 text-xs font-bold">✓ Verified</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-text-secondary font-medium flex-wrap">
                  <span>📍 {upcomingPickup.collectorDistance}</span>
                  <span>• 🕒 {upcomingPickup.timeSlot}</span>
                  <span className="text-brand-primary font-bold">• Est. Value: ₹{upcomingPickup.estimatedValue}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/my-pickups')}
                className="py-2.5 px-5 rounded-xl bg-brand-primary text-white font-bold text-xs sm:text-sm hover:bg-brand-dark transition cursor-pointer whitespace-nowrap"
              >
                View Pickup →
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-brand-bg text-brand-text-secondary rounded-full flex items-center justify-center mx-auto text-xl">
                🚚
              </div>
              <div>
                <h4 className="font-bold text-brand-text text-sm">No active pickups</h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">Your confirmed pickups will appear here.</p>
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

        {/* 5. Recent Activity Section */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-lg font-bold text-brand-text">Recent Activity</h3>
            {completedPickups.length > 0 && (
              <button
                onClick={() => navigate('/my-sales')}
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                View All History →
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
                      Paid via {p.paymentMethod || 'UPI'}
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
              <div>
                <h4 className="font-bold text-brand-text text-sm">No scrap sales yet</h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">Start by uploading a photo of your scrap.</p>
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

      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
