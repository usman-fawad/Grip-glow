import { createContext, useContext, useState } from 'react';

export const COUNTRIES = [
  { code: 'AUD', name: 'Australia',      flag: 'au', label: '🇦🇺 AUD — Australian Dollar', deliveryText: 'FAST TRACKED SHIPPING' },
  { code: 'USD', name: 'United States',  flag: 'us', label: '🇺🇸 USD — US Dollar',          deliveryText: 'FREE SHIPPING' },
  { code: 'GBP', name: 'United Kingdom', flag: 'gb', label: '🇬🇧 GBP — British Pound',     deliveryText: 'FREE DELIVERY' },
  { code: 'EUR', name: 'Europe',         flag: 'eu', label: '🇪🇺 EUR — Euro',              deliveryText: 'FAST TRACKED DELIVERY' },
  { code: 'CAD', name: 'Canada',         flag: 'ca', label: '🇨🇦 CAD — Canadian Dollar',    deliveryText: 'FAST TRACKED SHIPPING' },
  { code: 'NZD', name: 'New Zealand',    flag: 'nz', label: '🇳🇿 NZD — New Zealand Dollar', deliveryText: 'FAST TRACKED SHIPPING' },
];

const STORAGE_KEY = 'gripglow_country';

const CountryContext = createContext(null);

export function CountryProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = COUNTRIES.find(c => c.code === saved);
        if (found) return found;
      }
    } catch {
      // storage unavailable
    }
    return COUNTRIES[0]; // Default Australia AUD
  });

  const setCountry = (countryOrCode) => {
    const target = typeof countryOrCode === 'string'
      ? COUNTRIES.find(c => c.code === countryOrCode) || COUNTRIES[0]
      : countryOrCode;
    setSelectedCountry(target);
    try {
      localStorage.setItem(STORAGE_KEY, target.code);
    } catch {
      // ignore
    }
  };

  return (
    <CountryContext.Provider value={{ selectedCountry, setCountry, countries: COUNTRIES }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return ctx;
}
