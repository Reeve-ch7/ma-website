import React, { useState } from 'react';
import './Gallery.css';

const galleryItems = [
  { label: 'National Theatre — 2025', size: 'large', note: '♪', bg: '#1a1208' },
  { label: 'Recording Session', size: 'small', note: '♫', bg: '#0a1520' },
  { label: 'Tsion Album Cover', size: 'small', note: '♩', bg: '#150a20' },
  { label: 'East Africa Tour', size: 'medium', note: '♬', bg: '#0a1a10' },
  { label: 'Award Ceremony 2026', size: 'medium', note: '♪', bg: '#201008' },
  { label: 'Rehearsal — Addis', size: 'small', note: '♫', bg: '#101520' },
  { label: 'Live at Holy Trinity', size: 'small', note: '♩', bg: '#1a1010' },
];

const videoItems = [
  {
    title: 'Egziabher Yistilign — Official Video',
    views: '2.4M views',
    duration: '4:32',
    bg: '#1a1208',
  },
  {
    title: 'Live at National Theatre — Full Concert',
    views: '890K views',
    duration: '1:12:44',
    bg: '#0a1520',
  },
  {
    title: 'Tsion — Behind the Scenes',
    views: '340K views',
    duration: '8:15',
    bg: '#150a20',
  },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <section id="gallery" className="gallery">
      <div className="gallery__container">
        <div className="gallery__header">
          <p className="section-subtitle">Visual Journey</p>
          <h2 className="section-title">Gallery</h2>
          <div className="gold-divider" />
        </div>

        <div className="gallery__tabs">
          <button
            className={`gallery__tab ${activeTab === 'photos' ? 'gallery__tab--active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
          <button
            className={`gallery__tab ${activeTab === 'videos' ? 'gallery__tab--active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
        </div>

        {activeTab === 'photos' && (
          <div className="gallery__grid">
            {galleryItems.map((item, i) => (
              <div
                className={`gallery-item gallery-item--${item.size}`}
                key={i}
                style={{ background: item.bg }}
              >
                <div className="gallery-item__inner">
                  <span className="gallery-item__note">{item.note}</span>
                </div>
                <div className="gallery-item__overlay">
                  <span className="gallery-item__label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="gallery__videos">
            {videoItems.map((v, i) => (
              <div className="video-card" key={i} style={{ background: v.bg }}>
                <div className="video-card__thumb">
                  <div className="video-card__play-btn">▶</div>
                  <span className="video-card__duration">{v.duration}</span>
                </div>
                <div className="video-card__info">
                  <h3 className="video-card__title">{v.title}</h3>
                  <p className="video-card__views">{v.views}</p>
                </div>
              </div>
            ))}
            <div className="gallery__youtube">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                ▶ See More on YouTube
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
