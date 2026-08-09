import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import CitySelector from './CitySelector';

const collectorNavLinks = [
  { label: 'Dashboard',       path: '/collector/dashboard' },
  { label: 'Pickup Requests', path: '/collector/pickup-requests' },
  { label: 'My Pickups',       path: '/collector/my-pickups' },
  { label: 'Transactions',     path: '/collector/transactions' },
  { label: 'Store Profile',   path: '/collector/store-profile' },
];

export default function CollectorNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const businessName = user?.businessName || user?.name || 'Scrap Collector';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-card border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo + Partner Badge */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/collector/dashboard');
              }}
              className="flex items-center cursor-pointer"
            >
              <img src={logoImg} alt="ScrapNow Partner Logo" className="w-8 h-8 mr-2 object-contain" />
              <span className="text-xl font-bold text-brand-text tracking-tight">
                Scrap<span className="text-brand-primary">Now</span>
              </span>
            </a>
            <span className="px-2.5 py-0.5 bg-brand-light text-brand-dark text-[10px] font-extrabold rounded-full border border-brand-primary/20 uppercase tracking-wider">
              Partner
            </span>
          </div>

          {/* Center: Collector Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {collectorNavLinks.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`font-medium text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'text-brand-primary font-bold underline underline-offset-4 decoration-2'
                      : 'text-brand-text-secondary hover:text-brand-primary'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <CitySelector variant="compact" selectedCity={selectedCity} onCityChange={setSelectedCity} />

            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-brand-bg transition-colors cursor-pointer border border-brand-border/60"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                  👔
                </div>
                <div className="text-left min-w-0 max-w-[120px]">
                  <p className="text-xs font-bold text-brand-text truncate">{businessName}</p>
                  <span className="text-[10px] text-emerald-700 font-extrabold block">Collector Partner</span>
                </div>
                <svg className="w-4 h-4 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Functional Collector Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-brand-card border border-brand-border rounded-2xl shadow-xl py-2 animate-[slideUp_150ms_ease-out] z-50">
                  <div className="px-4 py-3 border-b border-brand-border">
                    <p className="text-sm font-bold text-brand-text truncate">{businessName}</p>
                    <p className="text-xs text-brand-text-secondary">+91 {user?.phone}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setIsUserMenuOpen(false); navigate('/collector/store-profile'); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>👤</span> View Profile
                    </button>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); navigate('/collector/store-profile'); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>🏪</span> Store Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2 cursor-pointer border-t border-brand-border mt-1 pt-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-text-secondary hover:text-brand-primary p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-card border-b border-brand-border px-4 py-3 space-y-2">
          {collectorNavLinks.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => { setIsMobileMenuOpen(false); navigate(path); }}
              className="block w-full text-left py-2 text-sm font-semibold text-brand-text hover:text-brand-primary"
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-center py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
