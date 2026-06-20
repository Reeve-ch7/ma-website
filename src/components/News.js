import React from 'react';
import './News.css';

const newsItems = [
  {
    date: '2026',
    tag: 'New Release',
    title: 'Daivam Pirakunnu — Now Streaming',
    excerpt:
      'Men Aloho\'s latest release "Daivam Pirakunnu" is now available on YouTube. A powerful Gospel rendition that has deeply moved audiences across Chennai and beyond. Click to watch now.',
    link: 'https://www.youtube.com/watch?v=gfeKQae5Wq0',
    linkLabel: 'Watch on YouTube',
  },
  {
    date: '2026',
    tag: 'Milestone',
    title: 'O Mariyame — Nearing 1 Million Views',
    excerpt:
      'Men Aloho\'s beloved rendition of "O Mariyame", from the service of the Easter Liturgy, is fast approaching 1 million views on YouTube. A testament to the power of their voices and the depth of their devotion.',
    link: 'https://www.youtube.com/watch?v=lMjbkypa8N8',
    linkLabel: 'Watch on YouTube',
  },
  {
    date: '2026',
    tag: 'Milestone',
    title: 'Growing Strong — 19 Voices, One Heart',
    excerpt:
      'From their humble beginnings in 2017, Men Aloho has grown into a 19-member male vocal ensemble representing Malankara Orthodox Churches across Chennai. Their unique blend of Western harmony and Indian melody continues to captivate.',
    link: 'https://www.youtube.com/@MenAloho',
    linkLabel: 'Explore More',
  },
  {
    date: '2026',
    tag: 'Performances',
    title: 'Available for Weddings, Baptisms & Special Events',
    excerpt:
      'Men Aloho is regularly invited to sing at weddings, baptism ceremonies, and other special occasions. Their liturgical expertise and Gospel repertoire make them the perfect choice for sacred celebrations.',
    link: '#contact',
    linkLabel: 'Book Us',
  },
];

export default function News() {
  return (
    <section id="news" className="news">
      <div className="news__container">
        <div className="news__header">
          <p className="section-subtitle">Latest Updates</p>
          <h2 className="section-title">News &amp; Updates</h2>
          <div className="gold-divider" />
        </div>

        <div className="news__grid">
          {newsItems.map((item, i) => (
            <article className="news-card" key={i}>
              <div className="news-card__meta">
                <span className="news-card__tag">{item.tag}</span>
                <span className="news-card__date">{item.date}</span>
              </div>
              <h3 className="news-card__title">{item.title}</h3>
              <p className="news-card__excerpt">{item.excerpt}</p>
              <a
                href={item.link}
                className="news-card__link"
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.linkLabel} <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
