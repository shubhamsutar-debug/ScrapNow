import React, { useState } from 'react';
import CollectorNavbar from '../components/CollectorNavbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function CollectorStoreProfile() {
  const { user, updateCollectorProfile } = useAuth();
  const { selectedCity } = useCity();

  const prof = user?.collectorProfile || {
    collectorId: 'COL-1001',
    name: user?.name || 'Rajesh Patil',
    phone: user?.phone || '9876543210',
    businessName: user?.businessName || 'Raj Scrap Center',
    shopAddress: 'Shop 12, Paud Road, Kothrud',
    city: selectedCity || 'Pune',
    pincode: '411038',
    acceptedCategories: ['Paper', 'Plastic', 'Metal', 'E-waste'],
    pickupAvailable: true,
    pickupRadiusKm: 10,
    workingDays: 'Mon - Sat',
    workingHours: '9:00 AM - 7:00 PM',
    minPickupKg: 5,
    createdAt: new Date().toISOString(),
  };

  // Local Form State
  const [name, setName] = useState(prof.name);
  const [businessName, setBusinessName] = useState(prof.businessName);
  const [phone, setPhone] = useState(prof.phone);
  const [shopAddress, setShopAddress] = useState(prof.shopAddress);
  const [city, setCity] = useState(prof.city);
  const [pincode, setPincode] = useState(prof.pincode);
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(prof.acceptedCategories);
  const [pickupAvailable, setPickupAvailable] = useState<boolean>(prof.pickupAvailable);
  const [pickupRadiusKm, setPickupRadiusKm] = useState<number>(prof.pickupRadiusKm);
  const [workingDays, setWorkingDays] = useState(prof.workingDays);
  const [workingHours, setWorkingHours] = useState(prof.workingHours);
  const [minPickupKg, setMinPickupKg] = useState<number>(prof.minPickupKg);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    setAcceptedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollectorProfile({
      name,
      businessName,
      phone,
      shopAddress,
      city,
      pincode,
      acceptedCategories,
      pickupAvailable,
      pickupRadiusKm,
      workingDays,
      workingHours,
      minPickupKg,
    });

    setToastMessage('✓ Store Profile updated successfully! Changes saved.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <CollectorNavbar />

      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-[slideDown_200ms_ease-out]">
          {toastMessage}
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">Store & Partner Profile</h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5">
            Manage your scrap shop details, operating coverage, and doorstep pickup preferences
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="border-b border-brand-border pb-3">
            <h3 className="text-lg font-bold text-brand-text">Business Information</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Collector Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Accepted Categories */}
            <div>
              <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                Accepted Scrap Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['Paper', 'Plastic', 'Metal', 'E-waste', 'Rubber', 'Other'].map((cat) => {
                  const isChecked = acceptedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-brand-light text-brand-dark border-brand-primary'
                          : 'bg-white text-brand-text-secondary border-brand-border'
                      }`}
                    >
                      <span>{cat}</span>
                      <span>{isChecked ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-brand-border pt-4">
              <h4 className="text-sm font-bold text-brand-text mb-3">Pickup Preferences</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Pickup Radius (km)
                  </label>
                  <select
                    value={pickupRadiusKm}
                    onChange={(e) => setPickupRadiusKm(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value={5}>5 km radius</option>
                    <option value={10}>10 km radius</option>
                    <option value={15}>15 km radius</option>
                    <option value={25}>25 km radius</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Minimum Pickup Requirement
                  </label>
                  <select
                    value={minPickupKg}
                    onChange={(e) => setMinPickupKg(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value={5}>Min 5 kg</option>
                    <option value={10}>Min 10 kg</option>
                    <option value={15}>Min 15 kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Working Days
                  </label>
                  <select
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option>Mon - Sat</option>
                    <option>All Days (Mon - Sun)</option>
                    <option>Mon - Fri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Working Hours
                  </label>
                  <select
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option>9:00 AM - 7:00 PM</option>
                    <option>8:00 AM - 8:00 PM</option>
                    <option>10:00 AM - 6:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-primary text-white font-extrabold text-sm rounded-xl hover:bg-brand-dark transition shadow-md cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
