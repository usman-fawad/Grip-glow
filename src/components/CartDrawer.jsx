import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, totalPrice } = useCart();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setIsOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`cart-backdrop${isOpen ? ' open' : ''}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Your Cart</h2>
          <button className="cart-drawer__close" aria-label="Close cart" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <ul aria-label="Cart items">
              {items.map(item => (
                <li key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} className="cart-item__img" />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">${(item.price * item.qty).toFixed(2)} AUD</p>
                    <div className="cart-item__qty">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >−</button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__foot">
            <div className="cart-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)} AUD</span>
            </div>
            <button
              className="btn btn-green btn-full cart-checkout"
              onClick={() => alert('Connect your payment gateway to enable checkout.')}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
