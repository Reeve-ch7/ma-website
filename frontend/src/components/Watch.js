import React from 'react';
import './Watch.css';

const PLAYLIST_ID = 'OLAK5uy_mJSPR5r1WldKlCBuTNzYHRpYDRAtOqN_g';

export default function Watch() {
  return (
    <section className="watch">
      <div className="watch__inner">
        <div className="watch__header">
          <p className="section-eyebrow">On Screen</p>
          <h2 className="section-title">Watch Us</h2>
          <div className="section-divider" />
        </div>

        <div className="watch__embed">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0`}
            title="Men Aloho on YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
