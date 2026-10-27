import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalQty, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (window.innerWidth <= 900) {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/products/flashlight', label: 'Magnetic Work Light' },
    { to: '/pages/track-your-order', label: 'Track Your Order' },
    { to: '/pages/contact', label: 'Contact' },
    { to: '/pages/about-us', label: 'About Us' },
  ];

  return (
    <>
      <header className="header">
        <div className="header__inner container">
          <NavLink to="/" className="logo" aria-label="GRIP GLOW home" onClick={() => setMenuOpen(false)}>
            <span className="logo-grip">GRIP </span><span className="logo-glow">GLOW</span>
          </NavLink>

          <nav className={`nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button
              className="cart-btn"
              id="cart-open-btn"
              aria-label={`Shopping cart, ${totalQty} item${totalQty !== 1 ? 's' : ''}`}
              onClick={() => {
                setMenuOpen(false);
                setIsOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalQty > 0 && (
                <span className="cart-badge" aria-hidden="true">{totalQty}</span>
              )}
            </button>

            <button
              className={`hamburger${menuOpen ? ' is-active' : ''}`}
              id="hamburger-btn"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav backdrop */}
      <div
        className={`nav-backdrop${menuOpen ? ' open' : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
