import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useCity } from '../context/CityContext';

export default function SelectCity() {
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, popularCities } = useCity();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);

  const filteredCities = popularCities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    navigate('/scrap-prices');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        
        {/* Centered Header Section matching reference design */}
        <div className="text-center space-y-4 max-w-xl mx-auto relative">
          
          {/* Decorative Location Icon Circle */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 bg-brand-light/80 rounded-full flex items-center justify-center border border-brand-primary/20 shadow-sm relative z-10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            
            {/* Subtle floating sparkle dots */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-primary/30" />
            <div className="absolute bottom-0 -left-2 w-2 h-2 rounded-full bg-brand-primary/40" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
            Select <span className="text-brand-primary">Your City</span>
          </h1>

          <p className="text-brand-text-secondary text-sm sm:text-base leading-relaxed">
            Choose your city to view current scrap prices and market rates in your area.
          </p>

          {/* Large Search Input */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-brand-text-secondary pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search your city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 bg-brand-card border border-brand-border rounded-2xl text-brand-text text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-brand-text-secondary hover:text-brand-text p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
            Popular Cities
          </h2>

          {filteredCities.length === 0 ? (
            <div className="text-center py-10 bg-brand-card border border-brand-border rounded-2xl p-6">
              <p className="text-brand-text font-semibold text-sm">No cities found matching "{searchTerm}"</p>
              <p className="text-brand-text-secondary text-xs mt-1">Try checking for typos or browse our supported cities list.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredCities.map((city) => {
                const isSelected = city === selectedCity;

                return (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'border-2 border-brand-primary bg-brand-light/50 text-brand-primary font-bold ring-2 ring-brand-primary/20 shadow-xs'
                        : 'bg-brand-card border border-brand-border text-brand-text hover:border-brand-primary/60 hover:bg-brand-light/20'
                    }`}
                  >
                    {isSelected && (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary flex-shrink-0">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    )}
                    <span className="truncate">{city}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Info Banner — Can't find your city? */}
        <div className="bg-gradient-to-r from-[#E6F7ED] via-brand-light/60 to-[#D1F3DD] border border-brand-primary/20 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-brand-primary/20 flex-shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-base">Can't find your city?</h3>
              <p className="text-brand-text-secondary text-xs sm:text-sm mt-0.5 max-w-lg">
                We're expanding to more locations. Contact our support team to check availability in your area.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSupportModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-card hover:bg-white text-brand-primary font-bold text-xs sm:text-sm rounded-xl border border-brand-primary/40 shadow-xs transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>🎧 Contact Support</span>
          </button>
        </div>

      </main>

      {/* Support Contact Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSupportModal(false)} />
          <div className="relative bg-brand-card rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 text-center">
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto text-2xl">
              🎧
            </div>
            <h3 className="font-bold text-brand-text text-lg">ScrapNow City Expansion Support</h3>
            <p className="text-brand-text-secondary text-xs">
              We are actively expanding across India. Want ScrapNow in your city? Reach out to us:
            </p>
            <div className="bg-brand-bg p-3 rounded-xl border border-brand-border text-xs text-brand-text space-y-1 font-medium">
              <p>Email: <span className="font-bold text-brand-primary">support@scrapnow.in</span></p>
              <p>Helpline: <span className="font-bold text-brand-text">+91 98765 43210</span></p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-dark transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
      <AuthModal />
    </div>
  );
}
