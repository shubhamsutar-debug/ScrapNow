import React, { useState, useRef, useEffect } from 'react';

export const CITIES = [
  'Pune',
  'Mumbai',
  'Nagpur',
  'Nashik',
  'Aurangabad',
  'Solapur',
  'Kolhapur',
  'Thane',
  'Navi Mumbai',
  'Pimpri-Chinchwad',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Ahmedabad',
];

interface CitySelectorProps {
  /** compact = navbar pill style, full = hero pill style */
  variant?: 'compact' | 'full';
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  variant = 'full',
  selectedCity,
  onCityChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const triggerClass =
    variant === 'compact'
      ? 'flex items-center space-x-1 px-3 py-1.5 bg-brand-bg rounded-full cursor-pointer hover:bg-brand-light transition-colors group'
      : 'bg-brand-card border border-brand-border rounded-full px-4 py-2.5 inline-flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer';

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Pin icon */}
        <svg
          width={variant === 'compact' ? 16 : 20}
          height={variant === 'compact' ? 16 : 20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-primary flex-shrink-0"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        <span
          className={`font-medium ${
            variant === 'compact'
              ? 'text-sm text-brand-text-secondary group-hover:text-brand-primary transition-colors'
              : 'text-brand-text text-sm'
          }`}
        >
          {selectedCity}
          {variant === 'full' && ', Maharashtra'}
        </span>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform flex-shrink-0 ${
            variant === 'compact'
              ? 'text-brand-text-secondary group-hover:text-brand-primary'
              : 'text-brand-text-secondary'
          } ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-brand-card border border-brand-border rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-brand-border bg-brand-bg focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* City list */}
          <ul
            role="listbox"
            className="max-h-52 overflow-y-auto py-1"
          >
            {filtered.length > 0 ? (
              filtered.map((city) => (
                <li
                  key={city}
                  role="option"
                  aria-selected={city === selectedCity}
                  onClick={() => {
                    onCityChange(city);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    city === selectedCity
                      ? 'text-brand-primary font-semibold bg-brand-light'
                      : 'text-brand-text hover:bg-brand-bg'
                  }`}
                >
                  {city}
                  {city === selectedCity && (
                    <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-brand-text-secondary text-center">
                No cities found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
