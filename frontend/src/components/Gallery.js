import React, { useState, useEffect } from 'react';
import { getGallery } from '../api/backend';
import './Gallery.css';

const FALLBACK_GALLERY = [
  { id: 'g1', label: 'National Theatre 2025', size: 'large',  hidden: false, url: '', bg: '#1a1208' },
  { id: 'g2', label: 'Recording Session',        size: 'small',  hidden: false, url: '', bg: '#0a1520' },
  { id: 'g3', label: 'Tsion Album Cover',        size: 'small',  hidden: false, url: '', bg: '#150a20' },
  { id: 'g4', label: 'East Africa Tour',         size: 'medium', hidden: false, url: '', bg: '#0a1a10' },
  { id: 'g5', label: 'Award Ceremony 2026',      size: 'medium', hidden: false, url: '', bg: '#201008' },
  { id: 'g6', label: 'Rehearsal, Addis',        size: 'small',  hidden: false, url: '', bg: '#101520' },
  { id: 'g7', label: 'Live at Holy Trinity',     size: 'small',  hidden: false, url: '', bg: '#1a1010' },
];

const NOTES = ['♪', '♫', '♩', '♬'];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY);

  useEffect(() => {
    getGallery().then(data => setGalleryItems(data)).catch(() => {});
  }, []);

  const visiblePhotos = galleryItems.filter(i => !i.hidden);

  return (
    <section id="gallery" className="gallery">
      <div className="gallery__container">
        <div className="gallery__header">
          <p className="section-subtitle">Visual Journey</p>
          <h2 className="section-title">Gallery</h2>
          <div className="gold-divider" />
        </div>

        <div className="gallery__grid">
          {visiblePhotos.map((item, i) => (
            <div
              className={`gallery-item gallery-item--${item.size}`}
              key={item.id || i}
              style={item.url ? undefined : { background: item.bg || '#1a1208' }}
            >
              {item.url
                ? <img src={item.url} alt={item.label} className="gallery-item__img" />
                : (
                  <div className="gallery-item__inner">
                    <span className="gallery-item__note">{NOTES[i % NOTES.length]}</span>
                  </div>
                )
              }
              <div className="gallery-item__overlay">
                <span className="gallery-item__label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
