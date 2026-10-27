import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function TrackOrderPage() {
  const [tracking, setTracking] = useState('');
  const [order, setOrder]       = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState('');

  useEffect(() => { document.title = 'Track Your Order | GRIP GLOW'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult('');
    if (!tracking.trim() && !order.trim()) {
      setError('Please enter a tracking number or order number.');
      return;
    }
    setLoading(true);
    // Simulate async lookup (replace with real API call)
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setResult('demo');
  };

  return (
    <>
      <main className="track-page" aria-labelledby="track-heading">
        <div className="container" style={{ width: '100%' }}>
          <div className="track-card tracking-glass-card">
            <h1 id="track-heading">Track Your Order</h1>
            <form onSubmit={handleSubmit} noValidate aria-label="Order tracking form">
              <label className="track-label" htmlFor="track-num">Tracking Number</label>
              <input
                id="track-num"
                type="text"
                className="track-input"
                placeholder="Enter Tracking Number"
                value={tracking}
                onChange={e => { setTracking(e.target.value); setError(''); }}
                autoComplete="off"
              />
              <div className="track-or" aria-hidden="true"><span>OR</span></div>
              <label className="track-label" htmlFor="order-num">Order Number</label>
              <input
                id="order-num"
                type="text"
                className="track-input"
                placeholder="Enter Order Number"
                value={order}
                onChange={e => { setOrder(e.target.value); setError(''); }}
                autoComplete="off"
              />
              <button type="submit" className="track-btn" disabled={loading}>
                {loading ? 'Looking up…' : 'Track'}
              </button>
              {error && <p className="track-err" role="alert">{error}</p>}
            </form>

            {result === 'demo' && (
              <div className="track-msg" role="status">
                <p>
                  <strong>No live tracking integration is configured yet.</strong><br />
                  To see real shipment updates, connect your shipping provider API.<br />
                  In the meantime, email us at{' '}
                  <a href="mailto:contact@gripglow.com">contact@gripglow.com</a> and we'll
                  look up your order manually.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
