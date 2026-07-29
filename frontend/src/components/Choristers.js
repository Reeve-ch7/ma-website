import React from 'react';
import './Choristers.css';

const voiceGroups = [
  {
    part: 'Tenor 1',
    members: [
      { name: 'Joseph P George',   img: '/members/joseph.jpeg',  pos: 'center 25%' },
      { name: 'Pramod Jacob John', img: '/members/pramod.jpg',  pos: 'center 10%' },
      { name: 'Sanju Sanu',        img: '/members/sanju.jpg',   pos: 'center 20%' },
    ],
  },
  {
    part: 'Tenor 2',
    members: [
      { name: 'Akhil C Kuriakose', img: '/members/akhil.jpg',   pos: 'center 25%', scale: 1.4 },
      { name: 'Jephin Jose',       img: '/members/jephin.jpg',  pos: 'center 10%' },
      { name: 'Jiby Chacko',       img: '/members/jiby.jpg',    pos: 'center 10%' },
      { name: 'Jino George',       img: '/members/jino.jpg',    pos: 'center 10%' },
      { name: 'Roshan Babu',       img: '/members/roshan.jpg',  pos: 'center 15%' },
      { name: 'Sajan Varghese',    img: '/members/sajan.jpg',   pos: 'center 10%' },
    ],
  },
  {
    part: 'Bass 1',
    members: [
      { name: 'Abhilash A Abraham', img: '/members/abhilash.jpg', pos: 'center 20%' },
      { name: 'Anish Kunjumon',     img: '/members/anishk.jpg',   pos: 'center 10%' },
      { name: 'Deepu Grasius',      img: '/members/deepu.jpg',    pos: 'center 10%' },
      { name: 'Nirmal Raj',         img: '/members/nirmal.jpg',   pos: 'center 15%' },
      { name: 'Pinku Jacob',        img: '/members/pinku.jpg',    pos: 'center 10%' },
      { name: 'Reeve Cherian',      img: '/members/reeve.jpg',    pos: 'center 10%' },
      { name: 'Shimron John Alexander', img: '/members/shimron.jpeg',  pos: 'center 10%' },
    ],
  },
  {
    part: 'Bass 2',
    members: [
      { name: 'Anish Mathew',      img: '/members/anishm.png',   pos: 'center 15%' },
      { name: 'Jayadeep Mathew',   img: '/members/jayadeep.jpg', pos: 'center 15%' },
      { name: 'John Itty Jacob',   img: '/members/john.jpg',     pos: 'center 15%' },
      { name: 'Rijo John Mathew',  img: '/members/rijo.jpg',     pos: 'center 10%' },
    ],
  },
];

const extendedFamily = [
  { name: 'Organized Chaos',             role: 'Quartet',     img: '/members/orgchaos.jpg',  pos: 'center 20%' },
  { name: 'Aben Jotham',                 role: 'Flute · Sax', img: '/members/aben.jpg',      pos: 'center 10%' },
  { name: 'Mackenzie Caleb',             role: 'Guitar',      img: '/members/mackenzie.jpg', pos: 'center 10%' },
  { name: 'Nathaniel Fletcher Franklin', role: 'Cello',       img: '/members/nathaniel.jpg', pos: 'center 15%' },
];

function MemberCard({ m }) {
  return (
    <div className="member-card">
      <div className="member-card__photo-wrap">
        <img
          src={m.img}
          alt={m.name}
          className="member-card__photo"
          style={{ objectPosition: m.pos || 'center 15%', transform: m.scale ? `scale(${m.scale})` : undefined }}
        />
      </div>
      <div className="member-card__info">
        <p className="member-card__name">{m.name}</p>
        {m.role && <p className="member-card__role">{m.role}</p>}
      </div>
    </div>
  );
}

export default function Choristers() {
  return (
    <div className="choristers-page">

      {/* ── CHORISTERS ── */}
      <div className="choristers-page__hero">
        <div className="about__choristers-container">
          <div className="about__section-header">
            <p className="section-subtitle">The Voices</p>
            <h1 className="section-title">Our Choristers</h1>
            <div className="gold-divider" />
            <p className="about__section-desc">
              Twenty voices, four parts, each one a distinct instrument in the ensemble.
            </p>
          </div>

          {voiceGroups.map((group) => (
            <div className="about__voice-group" key={group.part}>
              <div className="about__voice-group-label">
                <span>{group.part}</span>
                <div className="about__voice-group-line" />
              </div>
              <div className="about__members-grid">
                {group.members.map((m) => (
                  <MemberCard key={m.name} m={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXTENDED FAMILY ── */}
      <div className="about__extended-section">
        <div className="about__choristers-container">
          <div className="about__section-header">
            <p className="section-subtitle">Collaborators</p>
            <h2 className="section-title">Extended Family</h2>
            <div className="gold-divider" />
            <p className="about__section-desc">
              Beyond 20 bare voices, Men Aloho collaborates with eminent musicians
              for live shows and independent productions.
            </p>
          </div>
          <div className="about__members-grid about__members-grid--extended">
            {extendedFamily.map((m) => (
              <MemberCard key={m.name} m={m} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
