import React, { useState, useEffect } from 'react';
import { getNews } from '../api/backend';
import './News.css';

const FALLBACK_NEWS = [
  {
    id: 'n1',
    date: '2026',
    tag: 'New Release',
    title: 'Daivam Pirakunnu — Now Streaming',
    excerpt:
      'Men Aloho\'s latest release "Daivam Pirakunnu" is now available on YouTube. A powerful Gospel rendition that has deeply moved audiences across Chennai and beyond.',
    link: 'https://www.youtube.com/watch?v=gfeKQae5Wq0',
    linkLabel: 'Watch on YouTube',
    hidden: false,
  },
  {
    id: 'n2',
    date: '2026',
    tag: 'Milestone',
    title: 'O Mariyame — Nearing 1 Million Views',
    excerpt:
      'Their beloved Easter Liturgy rendition is fast approaching 1 million views — a testament to the power of their voices and the depth of their devotion.',
    link: 'https://www.youtube.com/watch?v=lMjbkypa8N8',
    linkLabel: 'Watch on YouTube',
    hidden: false,
  },
];

export default function News() {
  const [newsItems, setNewsItems] = useState(FALLBACK_NEWS);

  useEffect(() => {
    getNews()
      .then(data => setNewsItems(data))
      .catch(() => {});
  }, []);

  const visible = newsItems.filter(i => !i.hidden);

  return (
    <section id="news" className="news">
      <div className="news__container">
        <div className="news__header">
          <p className="section-subtitle">Latest Updates</p>
          <h2 className="section-title">News &amp; Updates</h2>
          <div className="gold-divider" />
        </div>

        <div className="news__grid">
          {visible.map((item, i) => (
            <article className="news-card" key={item.id || i}>
              {i === 0 && (
                <div className="news-card__accent">
                  <svg className="news-card__accent-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
              )}
              <div className="news-card__body">
                <div className="news-card__meta">
                  <span className="news-card__tag">{item.tag}</span>
                  <span className="news-card__date">{item.date}</span>
                </div>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__excerpt">{item.excerpt}</p>
                <a
                  href={item.link}
                  className="news-card__link"
                  target={item.link?.startsWith('http') ? '_blank' : undefined}
                  rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.linkLabel}{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
