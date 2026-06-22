import React, { useState, useEffect } from 'react';
import { getGallery, getVideos } from '../api/backend';
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

const FALLBACK_VIDEOS = [
  { id: 'v1', title: 'Egziabher Yistilign: Official Video',    views: '2.4M views', duration: '4:32',    hidden: false, url: '' },
  { id: 'v2', title: 'Live at National Theatre: Full Concert', views: '890K views', duration: '1:12:44', hidden: false, url: '' },
  { id: 'v3', title: 'Tsion: Behind the Scenes',               views: '340K views', duration: '8:15',    hidden: false, url: '' },
];

const NOTES = ['♪', '♫', '♩', '♬'];

function ytThumb(url) {
  const m = url?.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function ytLink(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : null;
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('photos');
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY);
  const [videoItems, setVideoItems] = useState(FALLBACK_VIDEOS);

  useEffect(() => {
    getGallery().then(data => setGalleryItems(data)).catch(() => {});
    getVideos().then(data => setVideoItems(data)).catch(() => {});
  }, []);

  const visiblePhotos = galleryItems.filter(i => !i.hidden);
  const visibleVideos = videoItems.filter(i => !i.hidden);

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
        )}

        {activeTab === 'videos' && (
          <div className="gallery__videos">
            {visibleVideos.map((v, i) => {
              const thumb = ytThumb(v.url);
              const link  = ytLink(v.url);
              const Card = link ? 'a' : 'div';
              return (
                <Card
                  className="video-card"
                  key={v.id || i}
                  {...(link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <div className="video-card__thumb" style={thumb ? undefined : { background: '#1a1208' }}>
                    {thumb
                      ? <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="video-card__play-btn">▶</div>
                    }
                    {v.duration && <span className="video-card__duration">{v.duration}</span>}
                  </div>
                  <div className="video-card__info">
                    <h3 className="video-card__title">{v.title}</h3>
                    {v.views && <p className="video-card__views">{v.views}</p>}
                  </div>
                </Card>
              );
            })}
            <div className="gallery__youtube">
              <a
                href="https://www.youtube.com/@MenAloho"
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
