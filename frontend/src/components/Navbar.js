import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Music', href: '#music' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Book Us', href: '#contact' },
];

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);


export default function Navbar({ scrolled, darkMode, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const navRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} ref={navRef}>
      <a href="#home" className="navbar__logo" onClick={() => setMenuOpen(false)}>
        <img
          src="/men-aloho-logo.jpg"
          alt="Men Aloho Logo"
          className="navbar__logo-img"
        />
        <span className="navbar__logo-main">Men Aloho</span>
      </a>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
        {isAdmin && (
          <li>
            <a href="/settings" className="navbar__settings-link" onClick={() => setMenuOpen(false)}>
              Settings
            </a>
          </li>
        )}
        <li className="navbar__menu-socials">
          <a href="https://www.youtube.com/@MenAloho" target="_blank" rel="noopener noreferrer" className="navbar__social-btn" aria-label="YouTube">
            <YouTubeIcon /> YouTube
          </a>
          <a href="https://open.spotify.com/artist/3elVp9RS2s3wh9ao7x3Xsg" target="_blank" rel="noopener noreferrer" className="navbar__social-btn" aria-label="Spotify">
            <SpotifyIcon /> Spotify
          </a>
          <a href="https://music.apple.com/in/artist/men-aloho/1820565917" target="_blank" rel="noopener noreferrer" className="navbar__social-btn" aria-label="Apple Music">
            <AppleMusicIcon /> Apple Music
          </a>
        </li>
        <li className="navbar__theme-li">
          <button className="navbar__theme-toggle" onClick={toggleDark} aria-label="Toggle theme">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </li>
      </ul>

      <div className="navbar__right">
        <a href="https://www.youtube.com/@MenAloho" target="_blank" rel="noopener noreferrer" className="navbar__social-btn navbar__social-btn--desktop" aria-label="YouTube">
          <YouTubeIcon />
        </a>
        <a href="https://open.spotify.com/artist/3elVp9RS2s3wh9ao7x3Xsg" target="_blank" rel="noopener noreferrer" className="navbar__social-btn navbar__social-btn--desktop" aria-label="Spotify">
          <SpotifyIcon />
        </a>
        <a href="https://music.apple.com/in/artist/men-aloho/1820565917" target="_blank" rel="noopener noreferrer" className="navbar__social-btn navbar__social-btn--desktop" aria-label="Apple Music">
          <AppleMusicIcon />
        </a>

        <button className="navbar__theme-toggle navbar__theme-toggle--desktop" onClick={toggleDark} aria-label="Toggle theme">
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar__burger-top" />
          <span className="navbar__burger-bottom" />
        </button>
      </div>
    </nav>
  );
}
