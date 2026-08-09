import { createContext, useContext, useState, type ReactNode } from 'react';

export const popularCities = [
  'Mumbai',
  'Pune',
  'Nashik',
  'Nagpur',
  'Aurangabad',
  'Solapur',
  'Kolhapur',
  'Ahmedabad',
  'Surat',
  'Indore',
  'Bhopal',
  'Jaipur',
  'Lucknow',
  'Hyderabad',
  'Bangalore',
  'Chennai',
  'Delhi',
  'Kolkata',
];

interface CityContextValue {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  popularCities: string[];
}

const CITY_STORAGE_KEY = 'scrapnow_city';

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(CITY_STORAGE_KEY);
      return stored && popularCities.includes(stored) ? stored : 'Pune';
    } catch {
      return 'Pune';
    }
  });

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem(CITY_STORAGE_KEY, city);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, popularCities }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return ctx;
}
