import React from 'react';
import './Hero.css';

export default function Hero() {
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
            ▶ Listen Now
          </a>
          <a href="#contact" className="btn-solid">Book Us</a>
        </div>
        <p className="hero__latest">
          Latest Release: <span>Daivam Pirakunnu</span>
        </p>
      </div>

      <div className="hero__scroll-hint">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
