import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-card border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <svg
              className="w-8 h-8 text-brand-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simple Recycling Logo Approximation */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xl font-bold text-brand-text tracking-tight">
              Scrap<span className="text-brand-primary">Now</span>
            </span>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <a
              href="#"
              className="text-brand-primary font-semibold underline underline-offset-4 decoration-2"
            >
              Home
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium"
            >
              Scrap Prices
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium"
            >
              For Collectors
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium"
            >
              About Us
            </a>
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
                xmlns="http://www.w3.org/2000/svg"
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Auth Buttons */}
            <button className="px-5 py-2 rounded-md border border-brand-border text-brand-text font-medium text-sm hover:bg-brand-bg transition-colors">
              Login
            </button>
            <button className="px-5 py-2 rounded-md bg-brand-primary text-white font-medium text-sm hover:bg-brand-dark transition-colors shadow-sm">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-brand-text-secondary hover:text-brand-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-semibold text-brand-primary bg-brand-light"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg transition-colors"
            >
              Scrap Prices
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg transition-colors"
            >
              For Collectors
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg transition-colors"
            >
              About Us
            </a>
            
            <div className="pt-4 pb-2 border-t border-brand-border mt-4">
              <div className="flex items-center px-3 py-2 mb-4 space-x-2 text-brand-text-secondary">
                <svg
                  className="w-5 h-5 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="font-medium text-base">Pune</span>
              </div>
              <div className="flex flex-col space-y-3 px-3">
                <button className="w-full text-center px-5 py-2.5 rounded-md border border-brand-border text-brand-text font-medium text-base hover:bg-brand-bg transition-colors">
                  Login
                </button>
                <button className="w-full text-center px-5 py-2.5 rounded-md bg-brand-primary text-white font-medium text-base hover:bg-brand-dark transition-colors shadow-sm">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
