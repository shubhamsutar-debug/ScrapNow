import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function CollectorRegister() {
  const navigate = useNavigate();
  const { user, registerCollector, isExistingUser } = useAuth();
  const { selectedCity } = useCity();

  // Wizard Step: 1 = Phone Verification, 2 = Details, 3 = Pickup Info
  const [step, setStep] = useState<number>(user ? 2 : 1);

  // Step 1 State: Mobile Verification
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  // Step 2 State: Collector Details
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [shopAddress, setShopAddress] = useState('');
  const [city, setCity] = useState(selectedCity || 'Pune');
  const [pincode, setPincode] = useState('411038');
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([
    'Paper',
    'Plastic',
    'Metal',
    'E-waste',
  ]);

  // Step 3 State: Pickup Information
  const [pickupAvailable, setPickupAvailable] = useState<boolean>(true);
  const [pickupRadiusKm, setPickupRadiusKm] = useState<number>(10);
  const [workingDays, setWorkingDays] = useState('Mon - Sat');
  const [workingHours, setWorkingHours] = useState('9:00 AM - 7:00 PM');
  const [minPickupKg, setMinPickupKg] = useState<number>(5);

  // ─── Step 1 Handlers: Mobile Verification ─────────────────────────────────

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    // Auto-fill OTP for demo convenience
    setTimeout(() => {
      setOtp(code.split(''));
    }, 400);
  };

  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length !== 6) {
      setOtpError('Please enter complete 6-digit code');
      return;
    }
    if (entered !== generatedOtp && entered !== '123456') {
      setOtpError('Incorrect OTP code');
      return;
    }
    setOtpError('');

    // Pre-fill existing user info if available
    const existing = isExistingUser(phone);
    if (existing) {
      setName(existing.name);
      if (existing.businessName) setBusinessName(existing.businessName);
    }
    setStep(2);
  };

  // ─── Category Checkbox Toggle Handler ───────────────────────────────────

  const toggleCategory = (cat: string) => {
    setAcceptedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ─── Final Submit Handler ────────────────────────────────────────────────

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim() || !shopAddress.trim()) {
      alert('Please fill out all required fields');
      return;
    }

    registerCollector({
      name,
      phone,
      businessName,
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

    // Direct redirect to Collector Dashboard
    navigate('/collector/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light text-brand-dark rounded-full text-xs font-bold border border-brand-primary/20">
            👔 ScrapNow Partner Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Register as a Scrap Collector
          </h1>
          <p className="text-brand-text-secondary text-xs sm:text-sm max-w-md mx-auto">
            Join India's leading scrap marketplace and grow your business with doorstep pickup orders in {city}.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[
            { id: 1, label: '1. Mobile Verification' },
            { id: 2, label: '2. Collector Details' },
            { id: 3, label: '3. Pickup Information' },
          ].map((s) => (
            <div
              key={s.id}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                step === s.id
                  ? 'bg-brand-primary text-white shadow-2xs'
                  : step > s.id
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-brand-card border border-brand-border text-brand-text-secondary'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 1 — MOBILE VERIFICATION
           ═════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 animate-[fadeIn_200ms_ease-out]">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                📱
              </div>
              <h3 className="text-xl font-bold text-brand-text">Verify Your Mobile Number</h3>
              <p className="text-xs text-brand-text-secondary">
                We will send a 6-digit verification code to your phone
              </p>
            </div>

            {!isOtpSent ? (
              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-text-secondary">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text font-bold text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  {phoneError && <p className="text-xs font-semibold text-red-500 mt-1">{phoneError}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
                >
                  Send Verification Code →
                </button>
              </div>
            ) : (
              <div className="space-y-5 max-w-sm mx-auto">
                <div className="bg-brand-light/60 border border-brand-primary/20 rounded-2xl p-3 text-center">
                  <p className="text-xs text-brand-dark font-medium">
                    Code sent to <strong>+91 {phone}</strong>
                  </p>
                  {generatedOtp && (
                    <p className="text-xs font-bold text-brand-primary mt-1">
                      Demo OTP Code: <span className="underline">{generatedOtp}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newOtp = [...otp];
                          newOtp[idx] = val;
                          setOtp(newOtp);
                        }}
                        className="w-10 h-12 text-center text-lg font-bold border border-brand-border rounded-xl focus:border-brand-primary focus:outline-none bg-white shadow-2xs"
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-xs font-semibold text-red-500 mt-1 text-center">{otpError}</p>}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
                >
                  Verify & Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 2 — COLLECTOR DETAILS
           ═════════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-[fadeIn_200ms_ease-out]"
          >
            <div className="border-b border-brand-border pb-3">
              <h3 className="text-lg font-bold text-brand-text">Collector & Shop Details</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Tell us about your scrap business and shop location
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Patil"
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Business / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Raj Scrap Center"
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Verified Mobile Number
                </label>
                <input
                  type="text"
                  disabled
                  value={`+91 ${phone}`}
                  className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg text-brand-text-secondary font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                  Shop / Business Address *
                </label>
                <input
                  type="text"
                  required
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  placeholder="e.g. Shop 12, Paud Road, Kothrud"
                  className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Scrap Categories Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                  Scrap Categories Accepted *
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
                            : 'bg-white text-brand-text-secondary border-brand-border hover:border-brand-primary/60'
                        }`}
                      >
                        <span>{cat}</span>
                        <span>{isChecked ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all shadow-xs cursor-pointer"
            >
              Next: Pickup Information →
            </button>
          </form>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
           STEP 3 — PICKUP INFORMATION & SUBMIT
           ═════════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <form
            onSubmit={handleCompleteRegistration}
            className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-[fadeIn_200ms_ease-out]"
          >
            <div className="border-b border-brand-border pb-3">
              <h3 className="text-lg font-bold text-brand-text">Pickup & Operating Information</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Set your doorstep pickup preferences and service coverage
              </p>
            </div>

            <div className="space-y-4">
              {/* Pickup Available */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-brand-border bg-brand-bg">
                <div>
                  <h4 className="font-bold text-brand-text text-sm">Doorstep Pickup Available?</h4>
                  <p className="text-[11px] text-brand-text-secondary">Accept doorstep pickup requests from customers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickupAvailable(!pickupAvailable)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    pickupAvailable ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {pickupAvailable ? 'YES' : 'NO'}
                </button>
              </div>

              {/* Radius & Min Weight */}
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

              {/* Days & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-5 rounded-xl border border-brand-border text-brand-text font-bold text-sm hover:bg-brand-bg transition"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-brand-primary text-white font-extrabold text-sm hover:bg-brand-dark transition-all shadow-md cursor-pointer"
              >
                Complete Collector Registration
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
