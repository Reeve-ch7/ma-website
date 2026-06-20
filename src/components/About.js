import React, { useState } from 'react';
import './About.css';

const choristers = [
  { name: 'Jephin Jose',        role: 'Lead Vocalist · Choir Leader', img: '/members/jephin.jpg',   pos: 'center 10%' },
  { name: 'Sajan Varghese',     role: 'Lead Vocalist',                img: '/members/sajan.jpg',    pos: 'center 10%' },
  { name: 'Akhil C Kuriakose',  role: 'Lead Vocalist',                img: '/members/akhil.jpg',    pos: 'center 10%' },
  { name: 'Jino George',        role: 'Lead Vocalist',                img: '/members/jino.jpg',     pos: 'center 10%' },
  { name: 'Roshan Babu',        role: 'Lead Vocalist',                img: '/members/roshan.jpg',   pos: 'center 15%' },
  { name: 'Jiby Chacko',        role: 'Lead Vocalist',                img: '/members/jiby.jpg',     pos: 'center 10%' },
  { name: 'Pramod Jacob John',  role: 'Tenor',                        img: '/members/pramod.jpg',   pos: 'center 10%' },
  { name: 'Pinku Jacob',        role: 'Tenor',                        img: '/members/pinku.jpg',    pos: 'center 10%' },
  { name: 'Sanju Sanu',         role: 'Tenor',                        img: '/members/sanju.jpg',    pos: 'center 20%' },
  { name: 'Reeve Cherian',      role: 'Tenor',                        img: '/members/reeve.jpg',    pos: 'center 10%' },
  { name: 'Nirmal Raj',         role: 'Baritone',                     img: '/members/nirmal.jpg',   pos: 'center 15%' },
  { name: 'Abhilash A Abraham', role: 'Baritone',                     img: '/members/abhilash.jpg', pos: 'center 20%' },
  { name: 'Anish Kunjumon',     role: 'Baritone',                     img: '/members/anishk.jpg',   pos: 'center 10%' },
  { name: 'Deepu Grasius',      role: 'Baritone',                     img: '/members/deepu.jpg',    pos: 'center 10%' },
  { name: 'John Itty Jacob',    role: 'Bass',                         img: '/members/john.jpg',     pos: 'center 15%' },
  { name: 'Anish Mathew',       role: 'Bass',                         img: '/members/anishm.jpg',   pos: 'center 15%' },
  { name: 'Jayadeep Mathew',    role: 'Bass',                         img: '/members/jayadeep.jpg', pos: 'center 15%' },
  { name: 'Rijo John Mathew',   role: 'Bass',                         img: '/members/rijo.jpg',     pos: 'center 10%' },
];

const extendedFamily = [
  { name: 'Organized Chaos',             role: 'Quartet',     img: '/members/orgchaos.jpg',  pos: 'center 20%' },
  { name: 'Aben Jotham',                 role: 'Flute · Sax', img: '/members/aben.jpg',      pos: 'center 10%' },
  { name: 'Mackenzie Caleb',             role: 'Guitar',      img: '/members/mackenzie.jpg', pos: 'center 10%' },
  { name: 'Nathaniel Fletcher Franklin', role: 'Cello',       img: '/members/nathaniel.jpg', pos: 'center 15%' },
];

function MemberCard({ m, extended }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`member-card ${extended ? 'member-card--extended' : ''} ${hovered ? 'member-card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="member-card__img-wrap">
        <img src={m.img} alt={m.name} className="member-card__photo" style={{ objectPosition: m.pos || 'center 15%' }} />
        <div className="member-card__overlay">
          <p className="member-card__overlay-role">{m.role}</p>
        </div>
      </div>
      <div className="member-card__info">
        <h4 className="member-card__name">{m.name}</h4>
        <p className="member-card__role">{m.role}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="about">

      {/* ── STORY SECTION ── */}
      <div className="about__story">
        <div className="about__story-text">
          <p className="section-subtitle">Our Story</p>
          <h2 className="section-title">About Men Aloho</h2>
          <div className="gold-divider" style={{ margin: '1.2rem 0' }} />
          <p className="about__bio">
            Formed in <strong>2017</strong>, Men Aloho is a group of male singers from
            various <strong>Malankara Orthodox Churches in Chennai</strong>, who share a
            deep love for Gospel and Liturgical music.
          </p>
          <p className="about__bio">
            <em>Men Aloho</em> is a <strong>Syriac phrase meaning "From God"</strong>.
            With a unique blend of voices, the group makes good use of Western harmony
            through part singing — while keeping their musical style predominantly Indian:
            a strong melody line, expressive slurs, and lyrical clarity. For liturgies,
            they focus on preserving the original Eastern Syrian tunes, believing that
            the natural depth of the male voice heightens the mystique of the liturgy.
          </p>
          <p className="about__bio">
            The group is regularly invited to sing at <strong>Weddings, Baptism
            ceremonies</strong>, and other special events.
          </p>
          <blockquote className="about__quote">
            "The natural depth of the male voice heightens the mystique of the liturgy."
            <cite>— Men Aloho</cite>
          </blockquote>
          <a href="#contact" className="btn-primary">Book the Choir</a>
        </div>

        {/* Director portrait */}
        <div className="about__director-panel">
          <div className="about__director-img-wrap">
            <img src="/members/joseph.jpg" alt="Joseph P George" className="about__director-img" />
            <div className="about__director-badge">
              <p className="about__director-name">Joseph P George</p>
              <p className="about__director-role">Choir Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHORISTERS SECTION ── */}
      <div className="about__choristers">
        <div className="about__choristers-header">
          <p className="section-subtitle">The Voices</p>
          <h2 className="section-title">Our Choristers</h2>
          <div className="gold-divider" />
        </div>
        <div className="about__members-grid">
          {choristers.map((m) => (
            <MemberCard key={m.name} m={m} />
          ))}
        </div>
      </div>

      {/* ── EXTENDED FAMILY ── */}
      <div className="about__choristers about__choristers--extended">
        <div className="about__choristers-header">
          <p className="section-subtitle">Collaborators</p>
          <h2 className="section-title">Extended Family</h2>
          <div className="gold-divider" />
          <p className="about__extended-desc">
            Apart from 19 bare voices, Men Aloho collaborates with eminent musicians
            for live shows and independent productions.
          </p>
        </div>
        <div className="about__members-grid about__members-grid--4">
          {extendedFamily.map((m) => (
            <MemberCard key={m.name} m={m} extended />
          ))}
        </div>
      </div>

    </section>
  );
}
