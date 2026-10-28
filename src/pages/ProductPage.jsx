import { useState, useEffect, useRef } from 'react';
import FAQAccordion from '../components/FAQAccordion';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useCountdown } from '../context/CountdownContext';
import { useCountry } from '../context/CountryContext';

const BUNDLES = [
  { qty: 1, label: '1 Light',  price: 87.00,  orig: 174.00, tag: null,           disc: null },
  { qty: 2, label: '2 Lights', price: 174.00, orig: 348.00, tag: 'Most Popular', disc: '10% OFF' },
  { qty: 3, label: '3 Lights', price: 261.00, orig: 522.00, tag: 'Best Value',   disc: '15% OFF' },
];

const GALLERY = [
  { src: '/All colours Light for Work.png', alt: 'The Grip Glow Magnetic Work Light - All Colours' },
  { src: '/Green Work Light.png', alt: 'The Grip Glow Magnetic Work Light - Green Edition', color: 'Green' },
  { src: '/Gif.mp4', alt: 'The Grip Glow Magnetic Work Light - In Action Demo', isVideo: true },
  { src: '/work light 2.png', alt: 'The Grip Glow Magnetic Work Light - High-Power COB Light' },
  { src: '/work light 3.png', alt: 'The Grip Glow Magnetic Work Light - Dual 360° Magnetic Swivel Base' },
  { src: '/work light 4.png', alt: 'The Grip Glow Magnetic Work Light - Engine Bay Mount' },
  { src: '/work light 5.png', alt: 'The Grip Glow Magnetic Work Light - Under-Car & Chassis Mount' },
  { src: '/work light 6.png', alt: 'The Grip Glow Magnetic Work Light - USB-C Rechargeable Battery' },
  { src: '/work light 7.png', alt: 'The Grip Glow Magnetic Work Light - Rugged Water-Resistant Design' },
  { src: '/Red LED Work Light .png', alt: 'The Grip Glow Magnetic Work Light - Red Edition', color: 'Red' },
  { src: '/Yellow Work Light.png', alt: 'The Grip Glow Magnetic Work Light - Yellow Edition', color: 'Yellow' },
];

const COLOR_OPTIONS = [
  { name: 'Green', hex: '#74d600', imgIndex: 1 },
  { name: 'Red', hex: '#e52b2b', imgIndex: 9 },
  { name: 'Yellow', hex: '#FFE600', imgIndex: 10 },
];

const FAQ_ITEMS = [
  {
    question: 'How do I secure the light while working?',
    answer: 'Strong magnets on both 360-degree rotating ends grip firmly to any ferrous metal surface. Simply place it against a steel panel, hood underside, or chassis component and it locks into position. No clamps or helpers required.',
  },
  {
    question: 'Will it melt plastic components if I leave it on in tight spaces?',
    answer: 'LED technology generates significantly less heat than halogen or incandescent bulbs. The Grip Glow is designed to remain cool during normal operation, making it much safer around plastic covers, wiring, and rubber seals. As a precaution, avoid placing any light directly in contact with heat-sensitive materials for extended periods.',
  },
];

function getDeliveryDates() {
  const today = new Date();
  const fmt = (d) => d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  const add = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  return { ordered: fmt(today), ready: fmt(add(1)), delivered: fmt(add(3)) };
}

export default function ProductPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [activeBundle, setActiveBundle] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Green');
  const [added, setAdded] = useState(false);
  const thumbsRef = useRef(null);
  const videoRef = useRef(null);
  const { addItem } = useCart();
  const { time } = useCountdown();
  const { selectedCountry } = useCountry();
  const dates = getDeliveryDates();

  useEffect(() => {
    document.title = 'The Grip Glow — Magnetic LED Work Light | GRIP GLOW';
  }, []);

  // Synchronize colour when active image changes to a colour edition
  useEffect(() => {
    const current = GALLERY[activeImg];
    if (current && current.color) {
      setSelectedColor(current.color);
    }
  }, [activeImg]);

  const handleColorSelect = (opt) => {
    setSelectedColor(opt.name);
    setActiveImg(opt.imgIndex);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const handlePrev = () => {
    setActiveImg((prev) => (prev === 0 ? GALLERY.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImg((prev) => (prev === GALLERY.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const activeEl = container.children[activeImg];
    if (!activeEl) return;
    const targetLeft = activeEl.offsetLeft - (container.clientWidth - activeEl.offsetWidth) / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth'
    });
  }, [activeImg]);

  const handleAddToCart = () => {
    const b = BUNDLES[activeBundle];
    const colorOpt = COLOR_OPTIONS.find(c => c.name === selectedColor) || COLOR_OPTIONS[0];
    addItem(
      {
        id: `gripglow-${b.qty}-${selectedColor.toLowerCase()}`,
        name: `The Grip Glow (${selectedColor}) ×${b.qty}`,
        price: b.price,
        img: GALLERY[colorOpt.imgIndex].src
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Determine delivery text based on selected country
  const deliveryHeadline =
    selectedCountry.code === 'GBP'
      ? 'FREE DELIVERY'
      : selectedCountry.code === 'USD'
      ? 'FREE SHIPPING'
      : selectedCountry.deliveryText;

  return (
    <>
      <main>
        <section className="product-page" aria-labelledby="product-heading">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a> › Magnetic Work Light
            </nav>

            <div className="product-page__grid">
              {/* ── LEFT: Gallery ── */}
              <div className="gallery">
                <div className="gallery__main" aria-roledescription="carousel" aria-label="Product Image Carousel">
                  <button
                    type="button"
                    className="gallery__nav-btn gallery__nav-btn--prev"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePrev();
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {GALLERY[activeImg].isVideo ? (
                    <video
                      key={GALLERY[activeImg].src}
                      src={GALLERY[activeImg].src}
                      className="gallery__main-img gallery__main-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label={GALLERY[activeImg].alt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  ) : (
                    <img
                      src={GALLERY[activeImg].src}
                      alt={GALLERY[activeImg].alt}
                      className="gallery__main-img"
                    />
                  )}

                  <button
                    type="button"
                    className="gallery__nav-btn gallery__nav-btn--next"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNext();
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="gallery__thumbs" role="list" ref={thumbsRef}>
                  {GALLERY.map((img, i) => (
                    img.isVideo ? (
                      <div
                        key={i}
                        className="gallery__thumb-wrapper"
                        style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveImg(i);
                        }}
                      >
                        <video
                          src={img.src}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className={`gallery__thumb${activeImg === i ? ' active' : ''}`}
                          style={{ objectFit: 'cover' }}
                          role="listitem"
                          tabIndex={0}
                          aria-label={`View demonstration video ${i + 1}: ${img.alt}`}
                          aria-current={activeImg === i}
                          onMouseDown={(e) => e.preventDefault()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveImg(i);
                            }
                          }}
                        />
                        <span
                          className="gallery__thumb-badge"
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            background: 'rgba(0, 0, 0, 0.75)',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="#FFE600" width="10" height="10">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <img
                        key={i}
                        src={img.src}
                        alt={img.alt}
                        className={`gallery__thumb${activeImg === i ? ' active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveImg(i);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveImg(i);
                          }
                        }}
                        role="listitem"
                        tabIndex={0}
                        aria-label={`View image ${i + 1}: ${img.alt}`}
                        aria-current={activeImg === i}
                      />
                    )
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Product Info ── */}
              <div className="pi">
                {/* Badge */}
                <div className="pi__badge-bar">
                  <span className="pi__badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13">
                      <path d="M9 21h6"/><path d="M12 3C8.686 3 6 5.686 6 9c0 2.21 1.134 4.145 2.852 5.27.474.312.898.74 1.148 1.23V17h4v-1.5c.25-.49.674-.918 1.148-1.23C16.866 13.145 18 11.21 18 9c0-3.314-2.686-6-6-6z"/>
                    </svg>
                    The #1 Work Light for Every Task
                  </span>
                </div>

                {/* Rating */}
                <div className="pi__rating">
                  <span className="pi__stars" aria-hidden="true">★★★★★</span>
                  <span className="pi__rt">4.9 Excellent</span>
                  <span className="pi__rt">|</span>
                  <span className="pi__rt">16,684+ Customers</span>
                </div>

                {/* Product Title + Compact Countdown Row */}
                <div className="pi__title-row">
                  <h1 id="product-heading" className="pi__title">Magnetic Work Light</h1>

                </div>

                {/* Price Row (30% OFF) */}
                <div className="pi__price-row">
                  <span className="pi__price-cur">$87.00 AUD</span>
                  <span className="pi__price-orig">$174.00 AUD</span>
                  <span className="pi__sale-pill">SALE 30% OFF</span>
                </div>

                {/* Colour Option Swatches */}
                <div className="pi__color-selector" aria-label="Colour Options">
                  <div className="pi__color-header">
                    <span className="pi__color-label">Colour:</span>
                    <span className="pi__color-name">{selectedColor}</span>
                  </div>
                  <div className="pi__color-swatches" role="radiogroup" aria-label="Select product colour">
                    {COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.name}
                        type="button"
                        className={`pi__color-btn${selectedColor === opt.name ? ' active' : ''}`}
                        onClick={() => handleColorSelect(opt)}
                        aria-label={`Select ${opt.name} colour`}
                        aria-checked={selectedColor === opt.name}
                        role="radio"
                        title={opt.name}
                      >
                        <span
                          className={`pi__color-circle pi__color-circle--${opt.name.toLowerCase()}`}
                          style={{ background: opt.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country-Based Delivery Text Badge */}
                <div className="pi__delivery-highlight" id="product-delivery-badge">
                  <div className="pi__delivery-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <rect x="1" y="3" width="15" height="13" rx="1"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <div className="pi__delivery-content">
                    <span className="pi__delivery-headline">{deliveryHeadline}</span>
                    <span className="pi__delivery-destination">
                      to {selectedCountry.name} • Tracked & Insured
                    </span>
                  </div>
                </div>

                <p className="pi__desc">
                  Get bright, <span>hands-free lighting</span> wherever you need it, from car repairs to weekend projects.
                </p>

                {/* Feature pills */}
                <div className="feature-grid" aria-label="Product features">
                  {[
                    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M4.93 4.93a10 10 0 000 14.14"/></svg>, label: 'COB Light' },
                    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/></svg>, label: 'Magnetic Base' },
                    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13"><path d="M21 12a9 9 0 11-6-8.5"/><polyline points="21 3 21 9 15 9"/></svg>, label: '360° Rotation' },
                    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg>, label: 'USB-C Powered' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="feature-pill">
                      {icon}
                      {label}
                    </div>
                  ))}
                </div>

                {/* Bundle selector */}
                <p className="bundle-label">How Many Do You Need?</p>
                <div className="bundle-grid" role="group" aria-label="Bundle options">
                  {BUNDLES.map((b, i) => (
                    <div
                      key={i}
                      className={`bundle-card${activeBundle === i ? ' active' : ''}`}
                      onClick={() => setActiveBundle(i)}
                      onKeyDown={e => e.key === 'Enter' && setActiveBundle(i)}
                      tabIndex={0}
                      role="radio"
                      aria-checked={activeBundle === i}
                      aria-label={`${b.label}, $${b.price.toFixed(2)} AUD`}
                    >
                      {b.tag && <span className="bundle-card__tag">{b.tag}</span>}
                      <span className="bundle-card__num">{b.label}</span>
                      <span className="bundle-card__price">${b.price.toFixed(2)} AUD</span>
                      <span className="bundle-card__orig">${b.orig.toFixed(2)} AUD</span>
                      {b.disc && <span className="bundle-card__disc">{b.disc}</span>}
                    </div>
                  ))}
                </div>

                {/* ATC */}
                <button
                  className={`btn btn-green btn-full atc-btn`}
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  aria-live="polite"
                >
                  {added ? '✓ Added to Cart!' : `ADD TO CART — $${BUNDLES[activeBundle].price.toFixed(2)} AUD`}
                </button>

                <p className="guarantee-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="13" height="13">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  30-day money-back guarantee
                </p>

                {/* Payment pills */}
                <div className="pay-row" aria-label="Accepted payment methods">
                  <span className="pay-pill pay-visa">VISA</span>
                  <span className="pay-pill pay-mc">MC</span>
                  <span className="pay-pill pay-amex">AMEX</span>
                  <span className="pay-pill pay-apple">&#63743; Pay</span>
                  <span className="pay-pill pay-google">G Pay</span>
                  <span className="pay-pill pay-paypal">PayPal</span>
                  <span className="pay-pill pay-shop">Shop</span>
                </div>

                {/* Delivery timeline */}
                <div className="delivery" aria-label="Estimated delivery timeline">
                  <div className="delivery__steps">
                    <div className="delivery__step">
                      <div className="delivery__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      </div>
                      <span className="delivery__date">{dates.ordered}</span>
                      <span className="delivery__lbl">Ordered</span>
                    </div>
                    <span className="delivery__arrow" aria-hidden="true">›</span>
                    <div className="delivery__step">
                      <div className="delivery__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <span className="delivery__date">{dates.ready}</span>
                      <span className="delivery__lbl">Order Ready</span>
                    </div>
                    <span className="delivery__arrow" aria-hidden="true">›</span>
                    <div className="delivery__step">
                      <div className="delivery__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      </div>
                      <span className="delivery__date">{dates.delivered}</span>
                      <span className="delivery__lbl">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div className="review-card">
                  <div className="reviewer-av" aria-hidden="true">G</div>
                  <div className="review-card__info">
                    <p className="rname">Garry M. <span className="rbadge">| Verified Buyer</span></p>
                    <p className="review-card__stars" aria-label="5 stars">★★★★★</p>
                    <p className="review-card__text">
                      "Had to fix a few things under my hood and this light made the whole job so much easier. I attached it, adjusted the angle, and finally had a clear view of what I was working on."
                    </p>
                  </div>
                </div>

                {/* Product FAQ */}
                <FAQAccordion items={FAQ_ITEMS} />
              </div>
            </div>
          </div>
        </section>

        {/* ── THE RIGHT LIGHT FOR EVERY JOB ── */}
        <section className="job-light-sec" aria-labelledby="job-light-heading">
          <div className="container job-light__container">
            <div className="job-light__header">
              <h2 id="job-light-heading" className="job-light__heading">
                The Right Light For Every Job
              </h2>
              <div className="job-light__underline" aria-hidden="true" />
              <p className="job-light__sub">
                From garage repairs to outdoor tasks, get the visibility you need without slowing down.
              </p>
            </div>

            <div className="job-light__grid">
              {/* Left Column — two product benefits */}
              <div className="job-light__col job-light__col--left">
                <div className="job-benefit">
                  <div className="job-benefit__header">
                    <div className="job-benefit__icon" aria-hidden="true">
                      <svg viewBox="0 0 54 44" fill="none" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="46" height="38">
                        <line x1="12" y1="4" x2="12" y2="6" strokeWidth="2" />
                        <line x1="20" y1="3" x2="20" y2="5" strokeWidth="2" />
                        <line x1="27" y1="2" x2="27" y2="5" strokeWidth="2" />
                        <line x1="34" y1="3" x2="34" y2="5" strokeWidth="2" />
                        <line x1="42" y1="4" x2="42" y2="6" strokeWidth="2" />
                        <rect x="8" y="9" width="38" height="26" rx="4" stroke="#FFE600" strokeWidth="2" />
                        <circle cx="16" cy="18" r="1.5" fill="#FFE600" />
                        <circle cx="23" cy="18" r="1.5" fill="#FFE600" />
                        <circle cx="31" cy="18" r="1.5" fill="#FFE600" />
                        <circle cx="38" cy="18" r="1.5" fill="#FFE600" />
                        <circle cx="16" cy="26" r="1.5" fill="#FFE600" />
                        <circle cx="23" cy="26" r="1.5" fill="#FFE600" />
                        <circle cx="31" cy="26" r="1.5" fill="#FFE600" />
                        <circle cx="38" cy="26" r="1.5" fill="#FFE600" />
                        <line x1="3" y1="22" x2="5" y2="22" strokeWidth="2" />
                        <line x1="49" y1="22" x2="51" y2="22" strokeWidth="2" />
                        <line x1="16" y1="39" x2="16" y2="41" strokeWidth="2" />
                        <line x1="27" y1="39" x2="27" y2="42" strokeWidth="2" />
                        <line x1="38" y1="39" x2="38" y2="41" strokeWidth="2" />
                      </svg>
                    </div>
                    <h3 className="job-benefit__title">COB LED Light</h3>
                  </div>
                  <p className="job-benefit__desc">
                    Wide, bright lighting that helps you see every detail while working.
                  </p>
                </div>

                <div className="job-benefit">
                  <div className="job-benefit__header">
                    <div className="job-benefit__icon" aria-hidden="true">
                      <svg viewBox="0 0 54 44" fill="none" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="46" height="38">
                        <rect x="6" y="8" width="42" height="28" rx="5" stroke="#FFE600" strokeWidth="2.2" />
                        <line x1="14" y1="22" x2="22" y2="22" strokeWidth="2.5" stroke="#FFE600" />
                        <line x1="28" y1="22" x2="34" y2="22" strokeWidth="2.5" stroke="#FFE600" />
                        <circle cx="39" cy="15" r="1.5" fill="#FFE600" />
                        <line x1="14" y1="15" x2="26" y2="15" strokeWidth="1.8" stroke="#FFE600" />
                      </svg>
                    </div>
                    <h3 className="job-benefit__title">Digital Battery Display</h3>
                  </div>
                  <p className="job-benefit__desc">
                    Real-time battery information helps you avoid unexpected downtime.
                  </p>
                </div>
              </div>

              {/* Center Column — uploaded video */}
              <div className="job-light__video-col">
                <div className="job-light__video-wrap">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="job-light__video"
                    aria-label="Demonstration video of The Grip Glow magnetic work light"
                    onClick={toggleVideo}
                  >
                    <source src="/305e7434475149fdb464665a0df2907f.HD-1080p-2.5Mbps-95890083.mp4" type="video/mp4" />
                    <source src="/Video review.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Right Column — two product benefits */}
              <div className="job-light__col job-light__col--right">
                <div className="job-benefit">
                  <div className="job-benefit__header">
                    <div className="job-benefit__icon" aria-hidden="true">
                      <svg viewBox="0 0 48 48" fill="none" stroke="#FFE600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="44" height="44">
                        <circle cx="24" cy="24" r="20" stroke="#FFE600" strokeWidth="2.2" strokeDasharray="30 8 30 8" />
                        <path d="M21 4L24 1L27 4" stroke="#FFE600" strokeWidth="2.2" />
                        <path d="M27 44L24 47L21 44" stroke="#FFE600" strokeWidth="2.2" />
                        <text x="24" y="29" fill="#FFE600" fontSize="13" fontWeight="900" fontFamily="Poppins, sans-serif" textAnchor="middle" stroke="none">360°</text>
                      </svg>
                    </div>
                    <h3 className="job-benefit__title">360° Rotating Design</h3>
                  </div>
                  <p className="job-benefit__desc">
                    Adjust the angle to direct light exactly where you need it.
                  </p>
                </div>

                <div className="job-benefit">
                  <div className="job-benefit__header">
                    <div className="job-benefit__icon" aria-hidden="true">
                      <svg viewBox="0 0 48 48" fill="none" stroke="#FFE600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="44" height="44">
                        <circle cx="24" cy="24" r="20" stroke="#FFE600" strokeWidth="2.2" />
                        <line x1="18" y1="15" x2="18" y2="19" strokeWidth="2.4" />
                        <line x1="30" y1="15" x2="30" y2="19" strokeWidth="2.4" />
                        <rect x="15" y="19" width="18" height="11" rx="3" strokeWidth="2.2" />
                        <line x1="24" y1="30" x2="24" y2="34" strokeWidth="2.4" />
                        <line x1="10" y1="38" x2="38" y2="10" stroke="#FFE600" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <h3 className="job-benefit__title">Cordless Use</h3>
                  </div>
                  <p className="job-benefit__desc">
                    No need to keep it plugged in thanks to the built-in rechargeable battery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
