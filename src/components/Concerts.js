import React from 'react';
import './Concerts.css';

const occasions = [
  { icon: '💒', title: 'Weddings', desc: 'Sacred hymns and Gospel arrangements to bless your special day.' },
  { icon: '✝️', title: 'Baptism Ceremonies', desc: 'Liturgical chants and devotional music for holy sacraments.' },
  { icon: '⛪', title: 'Church Events', desc: 'Feast days, anniversaries, and special parish celebrations.' },
  { icon: '🎶', title: 'Live Concerts', desc: 'Full-ensemble performances with optional orchestral accompaniment.' },
  { icon: '🎙️', title: 'Recordings', desc: 'Studio and live recording sessions for albums and productions.' },
  { icon: '🤝', title: 'Collaborations', desc: 'Open to collaborating with musicians, choirs, and ensembles.' },
];

export default function Concerts() {
  return (
    <section id="concerts" className="concerts">
      <div className="concerts__container">
        <div className="concerts__header">
          <p className="section-subtitle">Where You'll Find Us</p>
          <h2 className="section-title">Performances &amp; Events</h2>
          <div className="gold-divider" />
          <p className="concerts__intro">
            Men Aloho is regularly invited to perform at a wide range of sacred and
            celebratory occasions across Chennai and beyond.
          </p>
        </div>

        <div className="concerts__grid">
          {occasions.map((o, i) => (
            <div className="occasion-card" key={i}>
              <span className="occasion-card__icon">{o.icon}</span>
              <h3 className="occasion-card__title">{o.title}</h3>
              <p className="occasion-card__desc">{o.desc}</p>
            </div>
          ))}
        </div>

        <div className="concerts__cta">
          <p className="concerts__cta-text">
            Want Men Aloho at your event?
          </p>
          <a href="#contact" className="btn-solid">Book Us Now</a>
        </div>
      </div>
    </section>
  );
}
