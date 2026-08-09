import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import CitySelector from './CitySelector';
import { CollectorRegistrationModal } from './CollectorRegistrationModal';

type NavLink = {
  label: string;
  href: string;
  sectionId: string;
};

// Unauthenticated Public Links
const publicNavLinks: NavLink[] = [
  { label: 'Home',          href: '#home',          sectionId: 'home' },
  { label: 'Scrap Prices',  href: '/select-city',   sectionId: 'scrap-prices' },
  { label: 'How It Works',  href: '#how-it-works',  sectionId: 'how-it-works' },
  { label: 'For Collectors',href: '#for-collectors', sectionId: 'for-collectors' },
  { label: 'About Us',      href: '#about',         sectionId: 'about' },
];

// Authenticated Customer Dashboard Links
const authenticatedNavLinks = [
  { label: 'Dashboard',   path: '/dashboard' },
  { label: 'Sell Scrap',  path: '/sell-scrap' },
  { label: 'My Pickups',  path: '/my-pickups' },
  { label: 'Scrap Prices',path: '/scrap-prices' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollectorModalOpen, setIsCollectorModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, openAuthModal, logout } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();

  // Track active section using IntersectionObserver on home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionIds = publicNavLinks.map((l) => l.sectionId);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-50% 0px -50% 0px',
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePublicNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (sectionId === 'scrap-prices') {
      navigate('/select-city');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const navHeight = 64;
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navHeight = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-card border-b border-brand-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(user ? '/dashboard' : '/');
              }}
              className="flex-shrink-0 flex items-center"
              aria-label="ScrapNow home"
            >
              <img src={logoImg} alt="ScrapNow Logo" className="w-8 h-8 mr-2 object-contain" />
              <span className="text-xl font-bold text-brand-text tracking-tight">
                Scrap<span className="text-brand-primary">Now</span>
              </span>
            </a>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              {user ? (
                /* Authenticated Customer Links */
                authenticatedNavLinks.map(({ label, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      className={`font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'text-brand-primary font-bold underline underline-offset-4 decoration-2'
                          : 'text-brand-text-secondary hover:text-brand-primary'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })
              ) : (
                /* Unauthenticated Public Links */
                publicNavLinks.map(({ label, href, sectionId }) => {
                  const isActive = location.pathname === '/' && activeSection === sectionId;
                  return (
                    <a
                      key={sectionId}
                      href={href}
                      onClick={(e) => handlePublicNavClick(e, sectionId)}
                      className={`font-medium transition-colors ${
                        isActive
                          ? 'text-brand-primary font-semibold underline underline-offset-4 decoration-2'
                          : 'text-brand-text-secondary hover:text-brand-primary'
                      }`}
                    >
                      {label}
                    </a>
                  );
                })
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Location Pill */}
              <CitySelector
                variant="compact"
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
              />

              {/* User Dropdown / Login Button */}
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-brand-bg transition-colors cursor-pointer border border-brand-border/60"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-brand-text max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <svg className="w-4 h-4 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Authenticated User Profile Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-brand-card border border-brand-border rounded-2xl shadow-xl py-2 animate-[slideUp_150ms_ease-out] z-50">
                      <div className="px-4 py-3 border-b border-brand-border">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-brand-text truncate">{user.name}</p>
                          <span className="px-2 py-0.5 bg-brand-light text-brand-dark text-[10px] font-bold rounded-full uppercase">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-secondary mt-0.5">+91 {user.phone.slice(0, 5)} {user.phone.slice(5)}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); navigate('/dashboard'); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>📊</span> Dashboard
                        </button>

                        <button
                          onClick={() => { setIsUserMenuOpen(false); navigate('/sell-scrap'); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>♻️</span> Sell Scrap
                        </button>

                        <button
                          onClick={() => { setIsUserMenuOpen(false); navigate('/my-pickups'); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>🚚</span> My Pickups
                        </button>

                        <button
                          onClick={() => { setIsUserMenuOpen(false); navigate('/my-sales'); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-bg transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>💰</span> My Sales
                        </button>

                        {user.role !== 'collector' && (
                          <button
                            onClick={() => { setIsUserMenuOpen(false); setIsCollectorModalOpen(true); }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-2 cursor-pointer border-y border-emerald-100 my-1"
                          >
                            <span>👔</span> Become a Collector
                          </button>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-colors shadow-xs cursor-pointer"
                >
                  Login / Register
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-text-secondary hover:text-brand-primary focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-card border-b border-brand-border shadow-lg z-50">
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
              {user ? (
                authenticatedNavLinks.map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => { setIsMobileMenuOpen(false); navigate(path); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-brand-text hover:bg-brand-bg"
                  >
                    {label}
                  </button>
                ))
              ) : (
                publicNavLinks.map(({ label, href, sectionId }) => (
                  <a
                    key={sectionId}
                    href={href}
                    onClick={(e) => handlePublicNavClick(e, sectionId)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary"
                  >
                    {label}
                  </a>
                ))
              )}

              <div className="pt-4 pb-2 border-t border-brand-border mt-4">
                <div className="flex items-center px-3 py-2 mb-3">
                  <CitySelector variant="full" selectedCity={selectedCity} onCityChange={setSelectedCity} />
                </div>

                <div className="flex flex-col space-y-3 px-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-text truncate">{user.name}</p>
                          <p className="text-xs text-brand-text-secondary">+91 {user.phone.slice(0, 5)} {user.phone.slice(5)}</p>
                        </div>
                      </div>

                      {user.role !== 'collector' && (
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); setIsCollectorModalOpen(true); }}
                          className="w-full text-center px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-200"
                        >
                          👔 Become a Collector
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-center px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                      className="w-full text-center px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-base hover:bg-brand-dark shadow-sm"
                    >
                      Login / Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Become a Collector Registration Modal */}
      <CollectorRegistrationModal
        isOpen={isCollectorModalOpen}
        onClose={() => setIsCollectorModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
