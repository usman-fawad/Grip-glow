import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SALE_KEY = 'gripglow_sale_end';

function getOrInitDeadline() {
  // Default to 15 hours, 32 minutes, 22 seconds from now (matching screenshot reference)
  const DEFAULT_OFFSET_MS = (15 * 3600 + 32 * 60 + 22) * 1000;
  
  let saved = localStorage.getItem(SALE_KEY) || sessionStorage.getItem(SALE_KEY) || localStorage.getItem('voltalit_sale_end');
  let end = Number(saved);
  
  if (!end || isNaN(end) || end < Date.now()) {
    end = Date.now() + DEFAULT_OFFSET_MS;
    try {
      localStorage.setItem(SALE_KEY, String(end));
    } catch {
      // ignore storage quota/security errors
    }
  }
  return end;
}

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function calcRemaining(endTime) {
  const rem = Math.max(0, endTime - Date.now());
  const tot = Math.floor(rem / 1000);
  return {
    h: pad(Math.floor(tot / 3600)),
    m: pad(Math.floor((tot % 3600) / 60)),
    s: pad(tot % 60),
    totalSecs: tot,
    isExpired: tot <= 0,
  };
}

const CountdownContext = createContext(null);

export function CountdownProvider({ children }) {
  const endRef = useRef(getOrInitDeadline());
  const [time, setTime] = useState(() => calcRemaining(endRef.current));

  useEffect(() => {
    const tick = () => {
      setTime(calcRemaining(endRef.current));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CountdownContext.Provider value={{ time, endTime: endRef.current }}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const ctx = useContext(CountdownContext);
  if (!ctx) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return ctx;
}
