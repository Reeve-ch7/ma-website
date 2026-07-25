import React, { useState } from 'react';
import { API_BASE } from '../api/backend';
import './Enquiry.css';

const hearAboutOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'friend-family', label: 'Friend / Family' },
  { value: 'attended-event', label: 'Attended a Past Event' },
  { value: 'church', label: 'Church / Community' },
  { value: 'search', label: 'Google / Web Search' },
  { value: 'other', label: 'Other' },
];

export default function Enquiry() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '',
    eventDate: '', eventTime: '', location: '', hearAbout: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const hearAboutLabel = hearAboutOptions.find(o => o.value === form.hearAbout)?.label || 'Not specified';
      const enrichedMessage = [
        form.message.trim(),
        form.location.trim() && `Event location: ${form.location.trim()}`,
        form.eventTime && `Event time: ${form.eventTime}`,
        `How they heard about us: ${hearAboutLabel}`,
      ].filter(Boolean).join('\n\n');

      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, message: enrichedMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="enquiry-standalone">
      <div className="enquiry-standalone__card">
        {submitted ? (
          <div className="enquiry-standalone__success">
            <div className="enquiry-standalone__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>Enquiry Sent</h3>
            <p>Thank you for reaching out to Men Aloho. We'll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <div className="enquiry-standalone__header">
              <img src="/men-aloho-logo.jpg" alt="Men Aloho" className="enquiry-standalone__logo" />
              <p className="enquiry-standalone__eyebrow">Men Aloho</p>
              <h1>Enquiry Form</h1>
              <div className="enquiry-standalone__divider" />
              <p>Tell us about your event and we'll get back to you shortly.</p>
            </div>

            <form className="enquiry-standalone__form" onSubmit={handleSubmit}>
              <p className="enquiry-standalone__section-label">Your Details</p>
              <div className="enquiry-standalone__row">
                <div className="enquiry-standalone__field">
                  <label htmlFor="firstName">First Name *</label>
                  <input id="firstName" name="firstName" type="text" value={form.firstName}
                    onChange={handleChange} required />
                </div>
                <div className="enquiry-standalone__field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" type="text" value={form.lastName}
                    onChange={handleChange} />
                </div>
              </div>
              <div className="enquiry-standalone__row">
                <div className="enquiry-standalone__field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" value={form.email}
                    onChange={handleChange} required />
                </div>
                <div className="enquiry-standalone__field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input id="phone" name="phone" type="tel" value={form.phone}
                    onChange={handleChange} required />
                </div>
              </div>

              <p className="enquiry-standalone__section-label enquiry-standalone__section-label--spaced">Event Details</p>
              <div className="enquiry-standalone__row">
                <div className="enquiry-standalone__field">
                  <label htmlFor="subject">Event Type *</label>
                  <select id="subject" name="subject" value={form.subject}
                    onChange={handleChange} required>
                    <option value="">Type of event</option>
                    <option value="wedding">Wedding</option>
                    <option value="baptism">Baptism Ceremony</option>
                    <option value="church">Church Event</option>
                    <option value="concert">Live Concert</option>
                    <option value="recording">Recording / Production</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="enquiry-standalone__field">
                  <label htmlFor="eventDate">Event Date</label>
                  <input id="eventDate" name="eventDate" type="date" min={new Date().toISOString().split('T')[0]} value={form.eventDate}
                    onChange={handleChange} />
                </div>
              </div>
              <div className="enquiry-standalone__row">
                <div className="enquiry-standalone__field">
                  <label htmlFor="eventTime">Event Time</label>
                  <input id="eventTime" name="eventTime" type="time" value={form.eventTime}
                    onChange={handleChange} />
                </div>
                <div className="enquiry-standalone__field">
                  <label htmlFor="location">Event Location</label>
                  <input id="location" name="location" type="text" value={form.location}
                    onChange={handleChange} placeholder="City / venue" />
                </div>
              </div>
              <div className="enquiry-standalone__field">
                <label htmlFor="hearAbout">How Did You Hear About Us?</label>
                <select id="hearAbout" name="hearAbout" value={form.hearAbout}
                  onChange={handleChange}>
                  <option value="">Select an option</option>
                  {hearAboutOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="enquiry-standalone__field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={form.message}
                  onChange={handleChange} placeholder="Tell us about your event or inquiry..."
                  rows={5} />
              </div>
              {error && <p className="enquiry-standalone__error">{error}</p>}
              <button type="submit" className="enquiry-standalone__submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Submit Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>

      <a className="enquiry-standalone__cta" href="/">
        Visit Our Website
      </a>
    </div>
  );
}
