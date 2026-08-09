import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import authIllustration from '../assets/images/auth-illustration.jpg';

type AuthStep = 'phone' | 'otp' | 'verifying' | 'verified' | 'profile';

function generateOtp(): string {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return cleaned;
}

export default function AuthModal() {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    authRedirectIntent,
    closeAuthModal,
    login,
    isExistingUser,
    registerUser,
  } = useAuth();


  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Timer for OTP resend
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Timer tick for OTP step
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setGeneratedOtp('');
      setName('');
      setPhoneError('');
      setOtpError('');
      setNameError('');
      setTimer(30);
      setCanResend(false);
      setTimeout(() => phoneInputRef.current?.focus(), 150);
    }
  }, [isAuthModalOpen]);

  // Auto-fill OTP after entering step 2
  useEffect(() => {
    if (step === 'otp' && generatedOtp) {
      const timerId = setTimeout(() => {
        const digits = generatedOtp.split('');
        setOtp(digits);
      }, 800);
      return () => clearTimeout(timerId);
    }
  }, [step, generatedOtp]);

  // Auto-focus name input on profile step
  useEffect(() => {
    if (step === 'profile') {
      setTimeout(() => nameInputRef.current?.focus(), 150);
    }
  }, [step]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    setPhoneError('');
  };

  const handlePhoneContinue = () => {
    if (phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setTimer(30);
    setCanResend(false);
    setStep('otp');
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setTimer(30);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = useCallback(() => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }
    if (enteredOtp !== generatedOtp) {
      setOtpError('Incorrect verification code. Please try again.');
      return;
    }

    // Transition to 'verifying' state
    setStep('verifying');
    
    // After 1.2s verification animation, go to 'verified'
    setTimeout(() => {
      setStep('verified');
    }, 1200);
  }, [otp, generatedOtp]);

  const handleVerifiedContinue = () => {
    const existing = isExistingUser(phone);
    if (existing) {
      // If logging in via standard Login/Register button (not collector registration intent), set customer role
      const userToLogin = authRedirectIntent === 'collector-register'
        ? existing
        : { ...existing, role: 'user' as const };

      login(userToLogin);
      closeAuthModal();
      if (authRedirectIntent === 'sell-scrap') {
        navigate('/sell-scrap');
      } else if (authRedirectIntent === 'collector-register') {
        navigate('/collector/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (authRedirectIntent === 'collector-register') {
        closeAuthModal();
        navigate('/collector/register');
      } else {
        setStep('profile');
      }
    }
  };

  const handleProfileSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    const newUser = registerUser(phone, trimmedName);
    login(newUser);
    closeAuthModal();
    if (authRedirectIntent === 'sell-scrap') {
      navigate('/sell-scrap');
    } else {
      navigate('/dashboard');
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    setGeneratedOtp('');
    setOtpError('');
    setTimeout(() => phoneInputRef.current?.focus(), 150);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePhoneContinue();
  };
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleProfileSubmit();
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-[fadeIn_200ms_ease-out]"
        onClick={closeAuthModal}
      />

      {/* Main Redesigned Auth Container Card */}
      <div className="relative bg-brand-card rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-[slideUp_300ms_ease-out] z-10 my-auto border border-brand-border/60">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 z-20 text-brand-text-secondary hover:text-brand-text bg-white/80 hover:bg-white rounded-full p-2 backdrop-blur-md border border-brand-border/40 transition shadow-sm"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* ═══════════════════════════════════════════════════
             LEFT COLUMN — ScrapNow Branding (Desktop & Mobile header)
             ═══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#E6F7ED] via-brand-light to-[#D1F3DD] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Background Decorative Eco Leaves */}
            <div className="absolute top-[-20px] right-[-20px] w-36 h-36 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <img src={logoImg} alt="ScrapNow Logo" className="w-9 h-9 object-contain" />
                <span className="text-2xl font-bold text-brand-text tracking-tight">
                  Scrap<span className="text-brand-primary">Now</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text leading-tight">
                Recycle Today<br />
                <span className="text-brand-primary">For a Better Tomorrow</span>
              </h2>

              <p className="text-brand-text-secondary text-sm mt-3 leading-relaxed">
                Get the best value for your scrap and help create a cleaner, greener planet.
              </p>
            </div>

            {/* Center Illustration */}
            <div className="my-6 flex justify-center relative">
              <div className="relative z-10 w-full max-w-[260px] rounded-2xl overflow-hidden shadow-lg border-2 border-white/80">
                <img
                  src={authIllustration}
                  alt="Recycling Scrap Illustration"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>

            {/* Bottom Eco Badge */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-xl p-3 border border-white/90 shadow-sm text-xs font-medium text-brand-text-secondary">
              <span className="text-lg">🍃</span>
              <span>Join 10,000+ eco-conscious recyclers in Pune</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
             RIGHT COLUMN — Authentication Flow Steps
             ═══════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-brand-card">

            {/* STEP 1: Phone Entry */}
            {step === 'phone' && (
              <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
                <div>
                  <div className="flex items-center gap-2 mb-2 lg:hidden">
                    <img src={logoImg} alt="ScrapNow Logo" className="w-7 h-7 object-contain" />
                    <span className="text-lg font-bold text-brand-text">Scrap<span className="text-brand-primary">Now</span></span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text tracking-tight">Login / Register</h3>
                  <p className="text-brand-text-secondary text-sm mt-1">Enter your mobile number to continue</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="auth-phone-input" className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-brand-border focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all bg-brand-card overflow-hidden">
                      <span className="inline-flex items-center px-4 bg-brand-bg text-brand-text font-semibold text-sm border-r border-brand-border">
                        +91
                      </span>
                      <input
                        ref={phoneInputRef}
                        id="auth-phone-input"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-3.5 text-brand-text text-base font-medium focus:outline-none bg-transparent"
                        maxLength={10}
                        autoComplete="tel-national"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{phoneError}</p>
                    )}
                  </div>

                  <button
                    onClick={handlePhoneContinue}
                    disabled={phone.length !== 10}
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Continue</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>

                {/* 3 Compact Trust Points */}
                <div className="pt-4 border-t border-brand-border/60 grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary flex-shrink-0">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span>Best Rates</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary flex-shrink-0">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span>Zero Pickup</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary flex-shrink-0">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Trusted</span>
                  </div>
                </div>

                <p className="text-[11px] text-brand-text-secondary text-center leading-normal">
                  By continuing, you agree to ScrapNow's{' '}
                  <a href="#" className="underline hover:text-brand-primary">Terms of Service</a> and{' '}
                  <a href="#" className="underline hover:text-brand-primary">Privacy Policy</a>.
                </p>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
                <div>
                  <button
                    onClick={handleBackToPhone}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-text-secondary hover:text-brand-primary transition mb-3"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <h3 className="text-2xl font-bold text-brand-text">Verify Your Number</h3>
                  <p className="text-brand-text-secondary text-sm mt-1">
                    We've sent a verification code to <span className="font-semibold text-brand-text">+91 {formatPhone(phone)}</span>
                  </p>
                </div>

                {/* Auto-fill Indicator Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light text-brand-dark rounded-full text-xs font-semibold border border-brand-primary/20">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                  <span>✨ Demo OTP Auto-filled</span>
                </div>

                {/* 6 OTP Boxes */}
                <div className="flex justify-between gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-11 sm:w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                        digit
                          ? 'border-brand-primary bg-brand-light/40 text-brand-primary shadow-sm'
                          : 'border-brand-border bg-brand-bg text-brand-text'
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-500 text-xs font-medium text-center">{otpError}</p>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.join('').length !== 6}
                  className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify & Continue</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Countdown & Resend OTP */}
                <div className="flex items-center justify-between text-xs text-brand-text-secondary pt-2">
                  <span>Didn't receive code?</span>
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      className="font-bold text-brand-primary hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="font-medium text-brand-text-secondary">
                      Resend in <strong className="text-brand-text">{timer}s</strong>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3A: Verifying Animation State */}
            {step === 'verifying' && (
              <div className="text-center py-10 space-y-4 animate-[fadeIn_200ms_ease-out]">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-light border-t-brand-primary animate-spin" />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-text">Verifying Your Number...</h3>
                <p className="text-brand-text-secondary text-sm">Validating verification code</p>
              </div>
            )}

            {/* STEP 3B: Verified State */}
            {step === 'verified' && (
              <div className="text-center py-6 space-y-6 animate-[fadeIn_200ms_ease-out]">
                <div className="w-16 h-16 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-brand-text">✓ Number Verified!</h3>
                  <p className="text-brand-text-secondary text-sm mt-1">
                    Your mobile number has been successfully verified.
                  </p>
                  <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-bg rounded-xl border border-brand-border font-semibold text-brand-text text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-brand-primary">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>+91 {formatPhone(phone)}</span>
                  </div>
                </div>

                <button
                  onClick={handleVerifiedContinue}
                  className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-dark transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            )}

            {/* STEP 4: Complete Profile (New Users) */}
            {step === 'profile' && (
              <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
                <div>
                  <h3 className="text-2xl font-bold text-brand-text">Complete Your Profile</h3>
                  <p className="text-brand-text-secondary text-sm mt-1">Tell us a bit about yourself</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="auth-full-name" className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      ref={nameInputRef}
                      id="auth-full-name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError(''); }}
                      onKeyDown={handleNameKeyDown}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-card text-brand-text text-base font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                      autoComplete="name"
                    />
                    {nameError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Verified Mobile Number
                    </label>
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-brand-border bg-brand-bg text-brand-text font-medium text-sm">
                      <span className="font-semibold">+91 {formatPhone(phone)}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-full border border-brand-primary/20">
                        ✓ Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSubmit}
                    disabled={!name.trim()}
                    className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
