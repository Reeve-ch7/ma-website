import React, { useState, useEffect } from 'react';
import { getGroupPhoto } from '../api/backend';
import './About.css';

const voiceGroups = [
  {
    part: 'Lead Vocalists',
    members: [
      { name: 'Akhil C Kuriakose', role: 'Lead Vocalist', img: '/members/akhil.jpg',   pos: 'center 10%' },
      { name: 'Jephin Jose',       role: 'Lead Vocalist',   img: '/members/jephin.jpg',  pos: 'center 10%' },
      { name: 'Jiby Chacko',       role: 'Lead Vocalist', img: '/members/jiby.jpg',    pos: 'center 10%' },
      { name: 'Jino George',       role: 'Lead Vocalist', img: '/members/jino.jpg',    pos: 'center 10%' },
      { name: 'Roshan Babu',       role: 'Lead Vocalist', img: '/members/roshan.jpg',  pos: 'center 15%' },
      { name: 'Sajan Varghese',    role: 'Lead Vocalist', img: '/members/sajan.jpg',   pos: 'center 10%' },
    ],
  },
  {
    part: 'Tenors',
    members: [
      { name: 'Joseph P George',   role: 'Choir Director · Tenor', img: '/members/joseph.jpg',  pos: 'center 10%' },
      { name: 'Pramod Jacob John', role: 'Tenor',                  img: '/members/pramod.jpg',  pos: 'center 10%' },
      { name: 'Sanju Sanu',        role: 'Tenor',                  img: '/members/sanju.jpg',   pos: 'center 20%' },
    ],
  },
  {
    part: 'Baritones',
    members: [
      { name: 'Abhilash A Abraham', role: 'Baritone', img: '/members/abhilash.jpg', pos: 'center 20%' },
      { name: 'Anish Kunjumon',     role: 'Baritone', img: '/members/anishk.jpg',   pos: 'center 10%' },
      { name: 'Deepu Grasius',      role: 'Baritone', img: '/members/deepu.jpg',    pos: 'center 10%' },
      { name: 'Nirmal Raj',         role: 'Baritone', img: '/members/nirmal.jpg',   pos: 'center 15%' },
      { name: 'Pinku Jacob',        role: 'Baritone', img: '/members/pinku.jpg',    pos: 'center 10%' },
      { name: 'Reeve Cherian',      role: 'Baritone', img: '/members/reeve.jpg',    pos: 'center 10%' },
    ],
  },
  {
    part: 'Basses',
    members: [
      { name: 'Anish Mathew',      role: 'Bass', img: '/members/anishm.jpg',   pos: 'center 15%' },
      { name: 'Jayadeep Mathew',   role: 'Bass', img: '/members/jayadeep.jpg', pos: 'center 15%' },
      { name: 'John Itty Jacob',   role: 'Bass', img: '/members/john.jpg',     pos: 'center 15%' },
      { name: 'Rijo John Mathew',  role: 'Bass', img: '/members/rijo.jpg',     pos: 'center 10%' },
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
          style={{ objectPosition: m.pos || 'center 15%' }}
        />
      </div>
      <div className="member-card__info">
        <p className="member-card__name">{m.name}</p>
        <p className="member-card__role">{m.role}</p>
      </div>
    </div>
  );
}

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
            <p className="about__placeholder-sub">19 Voices · One Heart</p>
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

      {/* ── CHORISTERS ── */}
      <div className="about__choristers-section">
        <div className="about__choristers-container">

          <div className="about__section-header">
            <p className="section-subtitle">The Voices</p>
            <h2 className="section-title">Our Choristers</h2>
            <div className="gold-divider" />
            <p className="about__section-desc">
              Nineteen voices, four parts, each one a distinct instrument in the ensemble.
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
              Beyond 19 bare voices, Men Aloho collaborates with eminent musicians
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

    </section>
  );
}
