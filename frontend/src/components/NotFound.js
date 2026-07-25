import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <img src="/men-aloho-logo.jpg" alt="Men Aloho" className="not-found__logo" />
        <p className="not-found__eyebrow">Men Aloho</p>
        <div className="not-found__divider" />
        <h2 className="not-found__title">We Couldn't Find That Page</h2>
        <p className="not-found__desc">
          Sorry about that. Let's get you back to our website.
        </p>
        <Link to="/" className="not-found__cta">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
