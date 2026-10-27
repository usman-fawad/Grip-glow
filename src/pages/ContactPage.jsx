import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', comment: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitErr, setSubmitErr] = useState('');

  useEffect(() => { document.title = 'Contact Us | GRIP GLOW'; }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.comment.trim()) e.comment = 'Please enter a message.';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(ev => { const n = { ...ev }; delete n[field]; return n; });
    setSubmitErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setSubmitErr('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate async submission (replace with real backend/service)
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    // In production: if API call fails, setSubmitErr('...') instead
    setSuccess("Thanks for reaching out! We'll be in touch within 24 hours.");
    setForm({ name: '', email: '', phone: '', comment: '' });
  };

  return (
    <>
      <main className="contact-page" aria-labelledby="contact-heading">
        <h1 id="contact-heading">Contact Us</h1>
        <div className="contact-form-wrap">
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className="contact-row">
              <div>
                <label htmlFor="c-name" className="sr-only">Name</label>
                <input
                  id="c-name" type="text"
                  className={`contact-input${errors.name ? ' invalid' : ''}`}
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  autoComplete="given-name"
                />
                {errors.name && <p style={{color:'#f88',fontSize:'.75rem',marginTop:'-8px',marginBottom:'8px'}} role="alert">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="sr-only">Email</label>
                <input
                  id="c-email" type="email"
                  className={`contact-input${errors.email ? ' invalid' : ''}`}
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                />
                {errors.email && <p style={{color:'#f88',fontSize:'.75rem',marginTop:'-8px',marginBottom:'8px'}} role="alert">{errors.email}</p>}
              </div>
            </div>

            <label htmlFor="c-phone" className="sr-only">Phone number</label>
            <input
              id="c-phone" type="tel"
              className="contact-input"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange('phone')}
              autoComplete="tel"
            />

            <label htmlFor="c-comment" className="sr-only">Comment or message</label>
            <textarea
              id="c-comment"
              className={`contact-input${errors.comment ? ' invalid' : ''}`}
              placeholder="Comment"
              value={form.comment}
              onChange={handleChange('comment')}
              rows={5}
            />
            {errors.comment && <p style={{color:'#f88',fontSize:'.75rem',marginTop:'-8px',marginBottom:'8px'}} role="alert">{errors.comment}</p>}

            {submitErr && <p className="contact-err" role="alert">{submitErr}</p>}

            <button type="submit" className="contact-send" disabled={loading}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </form>

          {success && (
            <p className="contact-succ" role="status" aria-live="polite">{success}</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
