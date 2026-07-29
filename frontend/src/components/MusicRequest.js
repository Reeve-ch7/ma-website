import React from 'react';
import './MusicRequest.css';
import useInView from '../utils/useInView';

export default function MusicRequest() {
  const [ref, visible] = useInView();

  return (
    <section className="music-request">
      <div ref={ref} className={`music-request__inner fade-in-up${visible ? ' visible' : ''}`}>
        <p className="section-eyebrow">Get In Touch</p>
        <h2 className="section-title">Tracks &amp; Sheet Music</h2>
        <div className="section-divider" />
        <p className="music-request__body">
          Looking for backing tracks or sheet music from our recordings?
          We'd be happy to help. Reach out to us directly and we'll get back to you.
        </p>
        <a
          href="mailto:menaloho@gmail.com?subject=Request: Tracks / Sheet Music"
          className="btn-solid music-request__btn"
        >
          Email Us
        </a>
      </div>
    </section>
  );
}
