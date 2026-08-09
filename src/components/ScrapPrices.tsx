import { useState, useRef, useEffect } from 'react';
import ScrapCard from './ScrapCard';
import { scrapItems, categories, type ScrapItem } from '../data/scrapItems';

const ScrapPrices = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredItems = scrapItems.filter((item: ScrapItem) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [filteredItems]);

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text flex items-center gap-2">
            Today's Scrap Prices in <span className="text-brand-primary">Pune</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-input border border-brand-border bg-brand-card px-4 py-2 pl-9 pr-8 text-sm focus:outline-none focus:border-brand-primary"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-pill px-4 py-1.5 text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                    activeCategory === category 
                      ? 'bg-brand-primary text-white border-transparent' 
                      : 'bg-brand-card border border-brand-border text-brand-text-secondary hover:border-brand-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Area */}
        <div className="relative group">
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-brand-card shadow-lg border border-brand-border w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-brand-light transition text-brand-text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-4 scrap-scroll scrollbar-hide"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item: ScrapItem) => (
                <ScrapCard key={item.id} {...item} />
              ))
            ) : (
              <div className="w-full text-center py-12 text-brand-text-secondary">
                No scrap items found matching your criteria.
              </div>
            )}
          </div>

          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-brand-card shadow-lg border border-brand-border w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-brand-light transition text-brand-text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScrapPrices;
