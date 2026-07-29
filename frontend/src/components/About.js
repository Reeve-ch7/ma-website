import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroupPhoto } from '../api/backend';
import './About.css';

export default function About() {
  const [groupPhotoUrl, setGroupPhotoUrl] = useState('');
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const heroImgRef = React.useRef(null);

  useEffect(() => {
    getGroupPhoto().then(d => { if (d.url) setGroupPhotoUrl(d.url); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (heroImgRef.current?.complete && heroImgRef.current.naturalWidth > 0) {
      setPhotoLoaded(true);
    }
  }, []);

  return (
    <section id="about" className="about">

      {/* ── OUR STORY ── */}
      <div className="about__story-section">

        {/* Full-bleed landscape photo hero */}
        <div className="about__story-hero">
          <img
            ref={heroImgRef}
            src={groupPhotoUrl || '/members/group.jpg'}
            alt="Men Aloho: The Ensemble"
            className="about__story-hero-img"
            onLoad={() => setPhotoLoaded(true)}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="about__story-hero-placeholder" aria-hidden="true" style={{ opacity: photoLoaded ? 0 : 1, transition: 'opacity 0.4s ease' }}>
            <img src="/men-aloho-logo.jpg" alt="" className="about__placeholder-logo" />
            <p className="about__placeholder-name">Men Aloho</p>
            <p className="about__placeholder-sub">20 Voices · One Heart</p>
          </div>
          <div className="about__story-hero-overlay">
            <p className="about__story-hero-eyebrow">Est. 2017 · Chennai, India</p>
            <h2 className="about__story-hero-title">Men Aloho</h2>
            <p className="about__story-hero-syriac">"From God"</p>
          </div>
        </div>

        {/* Story content below photo */}
        <div className="about__story-content">
          <div className="about__story-bio">
            <p className="section-subtitle">Our Story</p>
            <p className="about__bio">
              Formed in <strong>2017</strong>, Men Aloho is a group of male singers from
              churches across <strong>Chennai, Bangalore, and Kochi</strong>, united by a
              shared love for Gospel and Liturgical music. The group is regularly invited
              to sing at weddings, baptism ceremonies, and special occasions.
            </p>
            <p className="about__bio">
              With a unique blend of voices, the group draws on Western harmony through
              part singing, while keeping their musical identity rooted in the Indian
              tradition: a strong melody line, expressive slurs, and lyrical clarity.
              For liturgies, they are devoted to preserving the original Eastern Syrian tunes.
            </p>
            <blockquote className="about__quote">
              "Men Aloho": a Syriac phrase meaning "From God."
            </blockquote>
            <a href="#contact" className="btn-primary">Book the Choir</a>
          </div>

        </div>

      </div>

      {/* ── CHORISTERS CTA ── */}
      <div className="about__choristers-cta">
        <div className="about__choristers-cta-inner">
          <p className="section-subtitle">The Voices</p>
          <h2 className="section-title">Our Choristers</h2>
          <div className="gold-divider" />
          <p className="about__section-desc">
            Twenty voices, four parts, each one a distinct instrument in the ensemble.
          </p>
          <Link to="/choristers" className="btn-primary">Meet the Choristers</Link>
        </div>
      </div>

    </section>
  );
}
