import { useState } from 'react';

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 21h6"/>
      <path d="M12 3C8.686 3 6 5.686 6 9c0 2.21 1.134 4.145 2.852 5.27.474.312.898.74 1.148 1.23V17h4v-1.5c.25-.49.674-.918 1.148-1.23C16.866 13.145 18 11.21 18 9c0-3.314-2.686-6-6-6z"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button
        className="faq-q"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="faq-bulb" aria-hidden="true"><BulbIcon /></span>
        <span className="faq-q-text">{question}</span>
        <ChevronIcon />
      </button>
      <div className={`faq-a${open ? ' open' : ''}`} role="region">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }) {
  return (
    <div className="faq-list" role="list">
      {items.map((item, i) => (
        <FAQItem key={i} {...item} />
      ))}
    </div>
  );
}
