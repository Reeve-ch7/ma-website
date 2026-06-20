import React, { useState } from 'react';
import './Contact.css';

const SocialIcon = ({ name }) => {
  if (name === 'Instagram') return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
  if (name === 'YouTube') return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  if (name === 'Facebook') return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  if (name === 'Spotify') return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
  return null;
};

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/menaloho', color: '#e1306c' },
  { name: 'YouTube', href: 'https://www.youtube.com/@MenAloho', color: '#ff0000' },
  { name: 'Facebook', href: 'https://www.facebook.com/MenAloho', color: '#1877f2' },
  { name: 'Spotify', href: 'https://open.spotify.com/artist/3elVp9RS2s3wh9ao7x3Xsg', color: '#1db954' },
];

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__container">

        {/* Left */}
        <div className="contact__left">
          <p className="section-subtitle">Reach Out to Us</p>
          <h2 className="section-title">Book Us</h2>
          <div className="gold-divider" style={{ margin: '1.2rem 0' }} />
          <p className="contact__desc">
            Please take a moment to fill out the form and we'll get back to you.
            Whether it's a wedding, baptism, church event, or a concert — we'd love
            to be part of your occasion.
          </p>

          <div className="contact__info-list">
            <div className="contact__info-item">
              <span className="contact__info-icon">✉</span>
              <div>
                <p className="contact__info-label">Booking Enquiries</p>
                <p className="contact__info-value">menaloho@gmail.com</p>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon">🎤</span>
              <div>
                <p className="contact__info-label">Management</p>
                <p className="contact__info-value">
                  Jephin Jose &nbsp;·&nbsp;
                  <a href="tel:+918925105222" className="contact__phone-link">+91 89251 05222</a>
                </p>
                <p className="contact__info-value">
                  Pramod Jacob John &nbsp;·&nbsp;
                  <a href="tel:+919500160320" className="contact__phone-link">+91 95001 60320</a>
                </p>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon">📍</span>
              <div>
                <p className="contact__info-label">Based In</p>
                <p className="contact__info-value">Chennai, India</p>
              </div>
            </div>
          </div>

          <div className="contact__social">
            <p className="contact__social-label">Follow Us</p>
            <div className="contact__social-links">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-btn"
                  style={{ '--brand': s.color }}
                  aria-label={s.name}
                >
                  <SocialIcon name={s.name} />
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="contact__right">
          {submitted ? (
            <div className="contact__success">
              <div className="contact__success-icon">✓</div>
              <h3>Message Sent</h3>
              <p>Thank you for reaching out to Men Aloho. We'll get back to you shortly.</p>
              <button className="btn-primary" onClick={() => setSubmitted(false)}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="firstName">First Name *</label>
                  <input id="firstName" name="firstName" type="text" value={form.firstName}
                    onChange={handleChange} placeholder="First name" required />
                </div>
                <div className="contact__field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" type="text" value={form.lastName}
                    onChange={handleChange} placeholder="Last name" />
                </div>
              </div>
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div className="contact__field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input id="phone" name="phone" type="tel" value={form.phone}
                    onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="contact__field">
                <label htmlFor="subject">Subject *</label>
                <select id="subject" name="subject" value={form.subject}
                  onChange={handleChange} required>
                  <option value="">Select a subject</option>
                  <option value="wedding">Wedding</option>
                  <option value="baptism">Baptism Ceremony</option>
                  <option value="church">Church Event</option>
                  <option value="concert">Live Concert</option>
                  <option value="recording">Recording / Production</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="contact__field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={form.message}
                  onChange={handleChange} placeholder="Tell us about your event or inquiry..."
                  rows={5} />
              </div>
              <button type="submit" className="btn-solid" style={{ width: '100%' }}>
                Submit
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
