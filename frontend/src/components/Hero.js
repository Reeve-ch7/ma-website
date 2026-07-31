import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile browsers can silently block the `autoPlay` attribute (iOS's
  // Safari "Never Auto-Play" setting, Low Power Mode, Data Saver, or
  // restrictive in-app browsers). Drive playback imperatively and, if the
  // browser still refuses, retry on the first real user gesture — that
  // reliably overrides these restrictions.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => video.play()?.catch(() => {});
    tryPlay();

    const events = ['touchstart', 'click', 'scroll', 'keydown'];
    const retry = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, retry));
    };
    events.forEach((e) => window.addEventListener(e, retry, { passive: true, once: true }));

    return () => events.forEach((e) => window.removeEventListener(e, retry));
  }, []);

  return (
    <section id="home" className="hero">
      <video
        ref={videoRef}
        className="hero__bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/bgVideos/sweet-spirit-bg.mp4"
      />
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Est. 2017 · Chennai, India</p>
        <h1 className="hero__title">Men Aloho</h1>
        <p className="hero__tagline">
          A male vocal ensemble from Chennai, Bangalore &amp; Kochi, rooted in Gospel &amp; Liturgical music.
        </p>
        <div className="hero__divider" />
        <div className="hero__buttons">
          <a
            href="#music"
            className="btn-primary"
            onClick={() => window.dispatchEvent(new Event('ma:play'))}
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
