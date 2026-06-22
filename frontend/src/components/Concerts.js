import React from 'react';
import './Concerts.css';

const RingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="22" height="22" aria-hidden="true">
    <line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="8" x2="19" y2="8"/>
  </svg>
);

const ChurchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/><path d="M9 21v-7h6v7"/><line x1="12" y1="3" x2="12" y2="0"/><line x1="10.5" y1="1.5" x2="13.5" y2="1.5"/>
  </svg>
);

const MusicNoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const occasions = [
  { Icon: RingsIcon,    title: 'Weddings',           desc: 'Sacred hymns and Gospel arrangements to bless your special day with music that moves hearts.' },
  { Icon: CrossIcon,    title: 'Baptism Ceremonies', desc: 'Liturgical chants and devotional music for holy sacraments and christening celebrations.' },
  { Icon: ChurchIcon,   title: 'Church Events',      desc: 'Feast days, anniversaries, and special parish celebrations, performed with reverence.' },
  { Icon: MusicNoteIcon,title: 'Live Concerts',      desc: 'Full-ensemble performances with optional orchestral accompaniment for a complete experience.' },
  { Icon: MicIcon,      title: 'Recordings',         desc: 'Studio and live recording sessions for albums, productions, and digital releases.' },
  { Icon: UsersIcon,    title: 'Collaborations',     desc: 'Open to collaborating with musicians, choirs, and ensembles across genres and traditions.' },
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
              <div className="occasion-card__icon-wrap">
                <o.Icon />
              </div>
              <h3 className="occasion-card__title">{o.title}</h3>
              <p className="occasion-card__desc">{o.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
