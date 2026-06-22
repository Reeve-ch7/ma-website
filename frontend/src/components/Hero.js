import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section id="home" className="hero">
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Est. 2017 · Chennai, India</p>
        <h1 className="hero__title">Men Aloho</h1>
        <p className="hero__tagline">
          "From God" — A male vocal ensemble rooted in Gospel &amp; Liturgical music
          from the Malankara Orthodox tradition.
        </p>
        <div className="hero__divider" />
        <div className="hero__buttons">
          <a
            href="https://www.youtube.com/watch?v=gfeKQae5Wq0"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>Listen Now
          </a>
          <a href="#contact" className="btn-solid">Book Us</a>
        </div>
        <p className="hero__latest">
          Latest Release: <span>Daivam Pirakunnu</span>
        </p>
      </div>

      <div className={`hero__scroll-hint${scrolled ? ' hero__scroll-hint--hidden' : ''}`}>
        <svg className="hero__scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
