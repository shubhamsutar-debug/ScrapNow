import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function CollectorTransactions() {
  const { user, pickups } = useAuth();

  const collectorId = user?.collectorProfile?.collectorId || user?.userId || '';

  // Only show this collector's completed transactions
  const completedPickups = pickups.filter(
    (p) => p.status === 'Completed' && p.collectorId === collectorId
  );

  const totalScrapCollectedKg = completedPickups.reduce(
    (acc, p) => acc + p.items.reduce((sum, item) => sum + item.weightKg, 0),
    0
  );
  const totalCashPaid = completedPickups.reduce((acc, p) => acc + p.estimatedValue, 0);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <CollectorNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">Transactions & Cash Paid</h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
            History of doorstep scrap purchases and cash payouts made to customers
          </p>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Total Scrap Collected
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {totalScrapCollectedKg} <span className="text-sm font-normal text-brand-text-secondary">kg</span>
            </div>
            <span className="text-[11px] text-brand-primary font-semibold">Recycled material volume</span>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Total Cash Paid
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
              ₹{totalCashPaid}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Paid to customers</span>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider block">
              Completed Transactions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {completedPickups.length}
            </div>
            <span className="text-[11px] text-brand-text-secondary font-medium">Successful pickups</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-brand-text border-b border-brand-border pb-3">
            Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-secondary font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Scrap Category</th>
                  <th className="pb-3">Weight</th>
                  <th className="pb-3">Amount Paid</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {completedPickups.map((p) => {
                  const categoriesText = p.items.map((i) => i.category).filter((v, i, a) => a.indexOf(v) === i).join(' + ');
                  const totalWeight = p.items.reduce((sum, i) => sum + i.weightKg, 0);

                  return (
                    <tr key={p.id} className="hover:bg-brand-bg/50 transition">
                      <td className="py-3.5 font-bold text-brand-text">{p.userName}</td>
                      <td className="py-3.5 font-semibold text-brand-text">{categoriesText}</td>
                      <td className="py-3.5 font-bold text-brand-text-secondary">{totalWeight} kg</td>
                      <td className="py-3.5 font-extrabold text-brand-primary">₹{p.estimatedValue}</td>
                      <td className="py-3.5 font-semibold text-brand-text">{p.paymentMethod || 'Cash'}</td>
                      <td className="py-3.5 text-brand-text-secondary">{p.completedAt || 'Aug 8, 2026'}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
