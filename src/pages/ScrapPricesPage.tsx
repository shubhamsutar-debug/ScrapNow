import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useCity } from '../context/CityContext';
import { getScrapItemsForCity, categories, type ScrapItem } from '../data/scrapItems';
import CitySelector from '../components/CitySelector';

export default function ScrapPricesPage() {
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity } = useCity();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const cityItems = getScrapItemsForCity(selectedCity);

  const filteredItems = cityItems.filter((item: ScrapItem) => {
    const matchesCategory =
      activeCategory === 'All' ||
      item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSharePrices = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Scrap Prices in ${selectedCity} — ScrapNow`,
          text: `Check today's scrap rates in ${selectedCity} on ScrapNow: Newspaper ₹11/kg, Iron ₹23/kg, Aluminium ₹150/kg!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* 1. Page Header matching reference */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Scrap Prices
          </h1>
          <p className="text-brand-text-secondary text-sm sm:text-base">
            Check the latest market rates for all scrap materials in{' '}
            <span className="text-brand-primary font-bold">{selectedCity}, Maharashtra</span>
          </p>
        </div>

        {/* 2. Search + Location Row matching reference */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Location Selector */}
          <div className="flex-shrink-0">
            <CitySelector
              variant="full"
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search any materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-9 py-2.5 sm:py-3 bg-brand-card border border-brand-border rounded-full text-brand-text text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 3. Category Filter Pills Row matching reference */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrap-scroll">
          {categories.map((category) => {
            const isActive = activeCategory.toLowerCase() === category.toLowerCase();
            const count =
              category === 'All'
                ? cityItems.length
                : cityItems.filter((i) => i.category.toLowerCase() === category.toLowerCase()).length;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-brand-card border border-brand-border text-brand-text hover:border-brand-primary/60 hover:text-brand-primary'
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand-bg text-brand-text-secondary'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. Scrap Item Cards Grid matching reference design */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-brand-card border border-brand-border rounded-2xl p-8">
            <div className="w-14 h-14 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-brand-text">No scrap materials found</h3>
            <p className="text-brand-text-secondary text-xs mt-1">
              No items match your query "{searchQuery || activeCategory}" in {selectedCity}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/sell-scrap')}
                className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 cursor-pointer group"
              >
                {/* Circular Small Image Container */}
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center border border-brand-border/60 overflow-hidden flex-shrink-0 p-1 group-hover:scale-105 transition-transform">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Card Text & Price */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand-text text-sm sm:text-base truncate group-hover:text-brand-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-brand-primary font-extrabold text-base sm:text-lg">
                      ₹{item.price}
                    </span>
                    <span className="text-xs font-medium text-brand-text-secondary">
                      /{item.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Bottom Information Banner matching reference */}
        <div className="bg-[#E6F7ED] border border-brand-primary/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs relative">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center text-lg font-bold shadow-2xs border border-brand-primary/20 flex-shrink-0">
              📈
            </div>
            <div>
              <h4 className="font-bold text-brand-text text-sm sm:text-base">
                Prices updated today, 10:30 AM
              </h4>
              <p className="text-brand-text-secondary text-xs mt-0.5">
                Rates may vary based on quality and market conditions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {copiedNotification && (
              <span className="text-xs text-brand-primary font-bold bg-white px-3 py-1.5 rounded-xl border border-brand-primary/30 animate-[fadeIn_150ms_ease-out]">
                ✓ Link Copied!
              </span>
            )}

            <button
              onClick={handleSharePrices}
              className="w-full sm:w-auto bg-white border border-brand-primary/40 text-brand-primary font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-brand-light transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share Prices</span>
            </button>
          </div>
        </div>

      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
