import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountry } from '../context/CountryContext';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setSuccess('Thanks for subscribing! Check your inbox for a confirmation.');
    setEmail('');
    setTimeout(() => setSuccess(''), 6000);
  };

  return (
    <form className="nl-form" onSubmit={submit} noValidate aria-label="Email newsletter signup">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input
        id="nl-email"
        type="email"
        className={`nl-input${error ? ' invalid' : ''}`}
        placeholder="Email"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(''); }}
        autoComplete="email"
      />
      <div className="nl-error" role="alert" aria-live="polite">{error}</div>
      <button type="submit" className="nl-btn">Sign up</button>
      <div className="nl-success" role="status" aria-live="polite">{success}</div>
    </form>
  );
}

export default function Footer() {
  const { selectedCountry, setCountry, countries } = useCountry();
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__col">
            <Link to="/" className="footer__logo" aria-label="GRIP GLOW home">
              <span className="logo-grip">GRIP </span><span className="logo-glow">GLOW</span>
            </Link>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4>Quick links</h4>
            <ul className="footer__links">
              {['Privacy Policy','Refund Policy','Shipping Policy','Terms of Service'].map(l => (
                <li key={l}><a href="#" className="footer__link">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__col">
            <h4>Subscribe to our emails</h4>
            <p className="footer__nl-desc">Subscribe to our newsletter for updates, exclusive offers, and more!</p>
            <NewsletterForm />
          </div>

          {/* Support */}
          <div className="footer__col">
            <h4>We're here to help</h4>
            <p className="footer__support-desc">For questions or assistance, contact us by phone or email. We respond promptly to resolve any concerns. Your satisfaction is our priority!</p>
            <a href="mailto:contact@gripglow.com" className="footer__email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@gripglow.com
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <div className="pay-row" aria-label="Accepted payment methods">
            <span className="pay-pill pay-visa">VISA</span>
            <span className="pay-pill pay-mc">MC</span>
            <span className="pay-pill pay-amex">AMEX</span>
            <span className="pay-pill pay-apple">&#63743; Pay</span>
            <span className="pay-pill pay-google">G Pay</span>
            <span className="pay-pill pay-paypal">PayPal</span>
            <span className="pay-pill pay-shop">Shop</span>
          </div>
          <p className="footer__copyright">© 2026, Grip Glow</p>
        </div>
      </div>

      {/* Currency selector */}
      <div className="currency-sel" style={{position:'fixed', bottom:20, left:20, zIndex:800}}>
        <button
          className="currency-sel__btn"
          aria-haspopup="listbox"
          aria-expanded={dropOpen}
          aria-label="Select currency"
          onClick={() => setDropOpen(o => !o)}
        >
          <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt={`${selectedCountry.code} flag`} width="20" height="14" />
          <span>{selectedCountry.code}</span>
          <svg className="currency-sel__chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
        <ul className={`currency-sel__drop${dropOpen ? ' open' : ''}`} role="listbox" aria-label="Currencies">
          {countries.map(c => (
            <li key={c.code} role="option" aria-selected={c.code === selectedCountry.code} tabIndex={0}
              onClick={() => { setCountry(c); setDropOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { setCountry(c); setDropOpen(false); }}}
            >{c.label}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
