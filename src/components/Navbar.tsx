import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';

type NavLink = {
  label: string;
  href: string;
  sectionId: string;
};

const navLinks: NavLink[] = [
  { label: 'Home',          href: '#home',          sectionId: 'home' },
  { label: 'Scrap Prices',  href: '#scrap-prices',  sectionId: 'scrap-prices' },
  { label: 'How It Works',  href: '#how-it-works',  sectionId: 'how-it-works' },
  { label: 'For Collectors',href: '#for-collectors', sectionId: 'for-collectors' },
  { label: 'About Us',      href: '#about',         sectionId: 'about' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, openAuthModal, logout } = useAuth();

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.sectionId);
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
  }, []);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const navHeight = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-card border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex-shrink-0 flex items-center"
            aria-label="ScrapNow home"
          >
            <img src={logoImg} alt="ScrapNow Logo" className="w-8 h-8 mr-2 object-contain" />
            <span className="text-xl font-bold text-brand-text tracking-tight">
              Scrap<span className="text-brand-primary">Now</span>
            </span>
          </a>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {navLinks.map(({ label, href, sectionId }) => {
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={sectionId}
                  href={href}
                  onClick={(e) => handleNavClick(e, sectionId)}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-brand-primary font-semibold underline underline-offset-4 decoration-2'
                      : 'text-brand-text-secondary hover:text-brand-primary'
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Location Pill */}
            <div className="flex items-center space-x-1 px-3 py-1.5 bg-brand-bg rounded-full cursor-pointer hover:bg-brand-light transition-colors group">
              <svg
                className="w-4 h-4 text-brand-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-brand-text-secondary group-hover:text-brand-primary transition-colors">
                Pune
              </span>
              <svg
                className="w-4 h-4 text-brand-text-secondary group-hover:text-brand-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Auth: Single button or logged-in user */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-brand-bg transition-colors"
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-brand-text max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <svg className="w-4 h-4 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-brand-card border border-brand-border rounded-xl shadow-lg py-2 animate-[slideUp_150ms_ease-out]">
                    <div className="px-4 py-2.5 border-b border-brand-border">
                      <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                      <p className="text-xs text-brand-text-secondary">+91 {user.phone.slice(0, 5)} {user.phone.slice(5)}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-5 py-2 rounded-md bg-brand-primary text-white font-medium text-sm hover:bg-brand-dark transition-colors shadow-sm"
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
              aria-expanded={isMobileMenuOpen}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-card border-b border-brand-border shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map(({ label, href, sectionId }) => {
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={sectionId}
                  href={href}
                  onClick={(e) => handleNavClick(e, sectionId)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'font-semibold text-brand-primary bg-brand-light'
                      : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg'
                  }`}
                >
                  {label}
                </a>
              );
            })}

            <div className="pt-4 pb-2 border-t border-brand-border mt-4">
              <div className="flex items-center px-3 py-2 mb-4 space-x-2 text-brand-text-secondary">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-base">Pune</span>
              </div>

              <div className="flex flex-col space-y-3 px-3">
                {user ? (
                  <>
                    {/* Logged-in mobile state */}
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                        <p className="text-xs text-brand-text-secondary">+91 {user.phone.slice(0, 5)} {user.phone.slice(5)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-5 py-2.5 rounded-md border border-red-200 text-red-600 font-medium text-base hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                    className="w-full text-center px-5 py-2.5 rounded-md bg-brand-primary text-white font-medium text-base hover:bg-brand-dark transition-colors shadow-sm"
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
  );
};

export default Navbar;
