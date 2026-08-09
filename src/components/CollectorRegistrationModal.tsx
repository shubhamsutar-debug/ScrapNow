import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

interface CollectorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollectorRegistrationModal: React.FC<CollectorRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, upgradeToCollector } = useAuth();
  const { selectedCity } = useCity();

  const [businessName, setBusinessName] = useState(user?.name ? `${user.name} Scrap Mart` : '');
  const [vehicleType, setVehicleType] = useState('Pickup Truck');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    upgradeToCollector(businessName, vehicleType);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]" onClick={onClose} />

      <div className="relative bg-brand-card rounded-3xl shadow-2xl w-full max-w-md p-8 animate-[slideUp_250ms_ease-out] z-10 space-y-6 border border-brand-border">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-brand-text-secondary hover:text-brand-text p-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
                👔
              </div>
              <h3 className="text-2xl font-bold text-brand-text">Become a Collector</h3>
              <p className="text-brand-text-secondary text-xs sm:text-sm">
                Grow your business by accepting doorstep scrap pickups in {selectedCity}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1.5">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. GreenCycle Traders"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-card text-brand-text text-sm focus:outline-none focus:border-brand-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1.5">
                  Primary Transport Vehicle
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-card text-brand-text text-sm focus:outline-none focus:border-brand-primary transition"
                >
                  <option>Pickup Truck (Tata Ace / Chhota Hathi)</option>
                  <option>Auto Rickshaw (3-Wheeler Loader)</option>
                  <option>Mini Van / Tempo</option>
                  <option>E-Rickshaw Loader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1.5">
                  Operating Location
                </label>
                <div className="px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-sm font-semibold flex items-center justify-between">
                  <span>{selectedCity}, Maharashtra</span>
                  <span className="text-brand-primary text-xs font-bold">✓ Active Area</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-md cursor-pointer"
            >
              Register as Collector →
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4 animate-[fadeIn_200ms_ease-out]">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md text-3xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-text">Collector Account Created!</h3>
              <p className="text-xs text-brand-text-secondary mt-1">
                You can now accept doorstep pickup requests in {selectedCity} as <strong>{businessName}</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
