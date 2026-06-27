import React, { useEffect, useRef } from 'react';
import './Music.css';

const ARTIST_ID = '3elVp9RS2s3wh9ao7x3Xsg';
const EMBED_URL = `https://open.spotify.com/embed/artist/${ARTIST_ID}?utm_source=generator&theme=0`;

export default function Music() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      iframeRef.current?.contentWindow?.postMessage({ command: 'play' }, 'https://open.spotify.com');
    };
    window.addEventListener('ma:play', handler);
    return () => window.removeEventListener('ma:play', handler);
  }, []);

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

        <div className="music__embed">
          <iframe
            ref={iframeRef}
            src={EMBED_URL}
            title="Men Aloho on Spotify"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>

      </div>
    </section>
  );
}
