import React, { useState, useEffect } from 'react';
import './Music.css';
import { fetchLatestReleases } from '../utils/spotify';
import { getMusicOverrides } from '../api/backend';

const ytSearch = (title) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent('Men Aloho ' + title)}`;

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);


function SkeletonCard() {
  return (
    <div className="music-card music-card--skeleton">
      <div className="music-card__cover music-card__cover--skeleton" />
      <div className="music-card__info">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--lg" />
        <div className="music-card__actions">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export default function Music() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCredentials, setNoCredentials] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchLatestReleases(10).catch(() => null),
      getMusicOverrides().catch(() => []),
    ]).then(([spotifyData, overrides]) => {
      if (!spotifyData) {
        setNoCredentials(true);
        setLoading(false);
        return;
      }
      // Apply overrides: filter hidden, sort by stored order
      const withOverrides = spotifyData.map(t => {
        const ov = overrides.find(o => o.spotifyId === t.id) || {};
        return { ...t, hidden: ov.hidden || false, _order: ov.order ?? null };
      });
      const visible = withOverrides.filter(t => !t.hidden);
      visible.sort((a, b) => {
        if (a._order !== null && b._order !== null) return a._order - b._order;
        if (a._order !== null) return -1;
        if (b._order !== null) return 1;
        return 0;
      });
      setTracks(visible);
      setLoading(false);
    });
  }, []);

  const featured = tracks[0] ?? null;
  const rest = tracks.slice(1);

  return (
    <section id="music" className="music">
      <div className="music__container">

        <div className="music__header">
          <p className="section-subtitle">Our Productions</p>
          <h2 className="section-title">Our Music</h2>
          <div className="gold-divider" />
          <p className="music__intro">
            Gospel, Liturgical, and original compositions, performed with the depth
            and sincerity that only 19 male voices can bring.
          </p>
        </div>

        {noCredentials && (
          <div className="music__setup-notice">
            <p>
              To load live releases, add <code>REACT_APP_SPOTIFY_CLIENT_ID</code> and{' '}
              <code>REACT_APP_SPOTIFY_CLIENT_SECRET</code> to <code>.env.local</code>.
              See <code>.env.local.example</code> for setup instructions.
            </p>
          </div>
        )}

        {/* ── Featured release ── */}
        {loading ? (
          <div className="music__featured music__featured--loading">
            <div className="music__featured-cover music__featured-cover--skeleton" />
            <div className="music__featured-info">
              <div className="skeleton-line skeleton-line--badge" />
              <div className="skeleton-line skeleton-line--sm" style={{ marginTop: 8 }} />
              <div className="skeleton-line skeleton-line--xl" style={{ marginTop: 10 }} />
              <div className="skeleton-line skeleton-line--md" style={{ marginTop: 12 }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <div className="skeleton-btn skeleton-btn--lg" />
                <div className="skeleton-btn skeleton-btn--lg" />
              </div>
            </div>
          </div>
        ) : featured ? (
          <div className="music__featured">
            <div className="music__featured-cover">
              {featured.cover
                ? <img src={featured.cover} alt={featured.title} className="music__featured-img" />
                : <span className="music__featured-note">♪</span>
              }
              <span className="music__featured-band">Men Aloho</span>
            </div>
            <div className="music__featured-info">
              <span className="music__featured-badge">Latest Release</span>
              <p className="music__featured-type">{featured.releaseYear}</p>
              <h3 className="music__featured-title">{featured.title}</h3>
              <div className="music__featured-actions">
                <a
                  href={featured.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-btn track-btn--spotify"
                >
                  <SpotifyIcon /> Listen on Spotify
                </a>
                <a
                  href={ytSearch(featured.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-btn track-btn--youtube"
                >
                  <YouTubeIcon /> Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Release grid ── */}
        <div className="music__grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : rest.map(r => (
                <div className="music-card" key={r.id}>
                  <div className="music-card__cover">
                    {r.cover
                      ? <img src={r.cover} alt={r.title} className="music-card__img" />
                      : <span className="music-card__note">♪</span>
                    }
                  </div>
                  <div className="music-card__info">
                    <span className="music-card__type">{r.releaseYear}</span>
                    <h3 className="music-card__title">{r.title}</h3>
                    <div className="music-card__actions">
                      <a
                        href={r.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="track-btn track-btn--spotify track-btn--sm"
                        aria-label={`Listen to ${r.title} on Spotify`}
                      >
                        <SpotifyIcon /> Spotify
                      </a>
                      <a
                        href={ytSearch(r.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="track-btn track-btn--youtube track-btn--sm"
                        aria-label={`Search ${r.title} on YouTube`}
                      >
                        <YouTubeIcon /> YouTube
                      </a>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>


      </div>
    </section>
  );
}
