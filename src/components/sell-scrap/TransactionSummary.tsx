import React, { useState } from 'react';
import { type ScrapItem } from '../../data/scrapItems';
import { type CollectorData } from './CollectorMap';

interface WeightItemEntry {
  item: ScrapItem;
  collectorRate: number;
  weightKg: number;
}

interface TransactionSummaryProps {
  collector: CollectorData;
  itemsWithWeights: WeightItemEntry[];
  totalAmount: number;
  userName: string;
  userPhone: string;
  onCompleteSelling: () => void;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  collector,
  itemsWithWeights,
  totalAmount,
  userName,
  userPhone,
  onCompleteSelling,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnId] = useState(() => `SN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [dateStr] = useState(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));

  const handleConfirmPayment = () => {
    setIsCompleted(true);
    onCompleteSelling();
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xs space-y-6 animate-[fadeIn_300ms_ease-out]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
              6
            </span>
            <h3 className="font-bold text-brand-text text-lg">Final Amount & Payment</h3>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              Step Completed
            </span>
          </div>
          <p className="text-brand-text-secondary text-xs sm:text-sm ml-8 mt-0.5">
            Review final item weights and confirm payment receipt
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-brand-text-secondary block font-medium">Txn ID</span>
          <span className="font-mono font-bold text-xs text-brand-text">{txnId}</span>
        </div>
      </div>

      {/* Big Final Amount Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-brand-dark to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
            Final Scrap Value Paid
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold mt-1">
            ₹{totalAmount.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Weighed & calculated by {collector.name}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
          <span className="text-2xl">💰</span>
          <span className="text-xs font-bold">Guaranteed Spot Payment</span>
        </div>
      </div>

      {/* Itemized Table Breakdown */}
      <div className="space-y-2">
        <h4 className="font-bold text-brand-text text-sm">Itemized Weight & Rate Breakdown</h4>
        
        <div className="overflow-x-auto rounded-xl border border-brand-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg text-brand-text-secondary font-semibold uppercase tracking-wider border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Item Material</th>
                <th className="py-3 px-4 text-center">Actual Weight</th>
                <th className="py-3 px-4 text-center">Collector Rate</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-text">
              {itemsWithWeights.map(({ item, collectorRate, weightKg }) => {
                const subtotal = collectorRate * weightKg;
                return (
                  <tr key={item.id} className="hover:bg-brand-bg/40">
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-7 h-7 object-contain rounded bg-white border border-brand-border p-0.5" />
                      <span>{item.name} ({item.category})</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{weightKg} kg</td>
                    <td className="py-3 px-4 text-center text-brand-primary font-bold">₹{collectorRate}/kg</td>
                    <td className="py-3 px-4 text-right font-extrabold">₹{subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-brand-light/40 font-bold border-t border-brand-border text-brand-text">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right">Total Payable Amount:</td>
                <td className="py-3 px-4 text-right text-brand-primary font-extrabold text-sm">
                  ₹{totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Method Selector or Receipt State */}
      {!isCompleted ? (
        <div className="space-y-4 pt-2 border-t border-brand-border">
          <h4 className="font-bold text-brand-text text-sm">Select Payment Method Received</h4>
          
          <div className="grid grid-cols-3 gap-3">
            {(['UPI', 'Cash', 'Bank Transfer'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-3 px-4 rounded-xl font-bold text-xs transition border flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === method
                    ? 'bg-brand-primary text-white border-brand-dark shadow-sm'
                    : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-primary'
                }`}
              >
                <span>{method === 'UPI' ? '📱 UPI / GPay' : method === 'Cash' ? '💵 Cash' : '🏦 Bank Transfer'}</span>
                <span className="text-[10px] opacity-90 font-normal">{method}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirmPayment}
            className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm Payment Received (₹{totalAmount.toFixed(2)})</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      ) : (
        /* Completed Transaction Receipt Stamp */
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-[fadeIn_300ms_ease-out]">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md text-2xl font-bold">
            ✓
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-950">✓ Selling Completed!</h3>
            <p className="text-xs text-emerald-800 mt-1 font-medium">
              Thank you for contributing to a greener planet with ScrapNow!
            </p>
          </div>

          {/* Receipt details summary */}
          <div className="bg-white rounded-xl p-4 text-xs text-left space-y-2 border border-emerald-200 shadow-2xs max-w-md mx-auto font-mono">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-bold text-gray-900">{txnId}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-semibold text-gray-900">{dateStr}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-gray-500">Collector:</span>
              <span className="font-semibold text-gray-900">{collector.name}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-gray-500">Customer:</span>
              <span className="font-semibold text-gray-900">{userName} ({userPhone})</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-bold text-emerald-700">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold text-gray-900">
              <span>Total Received:</span>
              <span className="text-emerald-600 font-black">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs rounded-xl hover:bg-emerald-100 transition shadow-2xs"
            >
              🖨 Print Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
