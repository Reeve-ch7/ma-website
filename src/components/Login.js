import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../api/backend';
import { useAdmin } from '../context/AdminContext';
import './Login.css';

export default function Login() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await apiLogin(passcode);
      login(token);
      navigate('/settings');
    } catch {
      setError('Incorrect passcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <a href="/" className="login-logo">
          <img src="/men-aloho-logo.jpg" alt="Men Aloho" className="login-logo-img" />
          <span>Men Aloho</span>
        </a>
        <p className="login-eyebrow">Admin</p>
        <h1 className="login-title">Access</h1>
        <div className="login-divider" />
        <p className="login-subtitle">Enter the passcode to manage site content</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="passcode">Passcode</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading || !passcode}>
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>

        <a href="/" className="login-back">← Back to site</a>
      </div>
    </div>
  );
}
