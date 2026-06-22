import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  getGallery, saveGallery,
  getVideos, saveVideos,
  getNews, saveNews,
  getMusicOverrides, saveMusicOverrides,
  getGroupPhoto, saveGroupPhoto,
  uploadFile,
} from '../api/backend';
import { fetchLatestReleases } from '../utils/spotify';
import './Settings.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconUp    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="18 15 12 9 6 15"/></svg>;
const IconDown  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>;
const IconPlus  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEye   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function move(arr, i, dir) {
  const a = [...arr];
  const j = i + dir;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SaveBar({ onSave, saving, saved }) {
  return (
    <div className="settings-savebar">
      <button className="settings-save-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving…' : saved ? <><IconCheck /> Saved</> : 'Save Changes'}
      </button>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      className={`settings-toggle ${value ? 'settings-toggle--on' : ''}`}
      onClick={() => onChange(!value)}
      title={value ? 'Visible' : 'Hidden'}
    >
      {value ? <IconEye /> : <IconEyeOff />}
    </button>
  );
}

function ReorderBtns({ i, total, onMove }) {
  return (
    <div className="settings-reorder">
      <button onClick={() => onMove(i, -1)} disabled={i === 0} className="settings-icon-btn" title="Move up"><IconUp /></button>
      <button onClick={() => onMove(i, 1)} disabled={i === total - 1} className="settings-icon-btn" title="Move down"><IconDown /></button>
    </div>
  );
}

// ── Gallery Tab ───────────────────────────────────────────────────────────────

function GalleryTab() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => {
    getGallery().then(setItems).catch(() => {});
  }, []);

  const update = (i, key, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  const onMove = (i, dir) => setItems(prev => move(prev, i, dir));
  const onDelete = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const onAdd = () => setItems(prev => [...prev, { id: newId(), url: '', label: 'New Photo', size: 'small', hidden: false }]);

  const onUpload = async (i, file) => {
    setUploading(i);
    try {
      const url = await uploadFile(file);
      update(i, 'url', url);
    } catch {
      alert('Upload failed. Check that the backend server is running.');
    } finally {
      setUploading(null);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await saveGallery(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Save failed. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-tab-content">
      <div className="settings-tab-header">
        <p className="settings-tab-eyebrow">Visual Journey</p>
        <h2 className="settings-tab-title">Gallery Photos</h2>
        <div className="settings-tab-divider" />
        <div className="settings-tab-actions">
          <span />
          <button className="settings-add-btn" onClick={onAdd}><IconPlus /> Add Photo</button>
        </div>
      </div>

      <div className="settings-list">
        {items.map((item, i) => (
          <div className={`settings-item ${item.hidden ? 'settings-item--hidden' : ''}`} key={item.id}>
            <div className="settings-item-thumb">
              {item.url
                ? <img src={item.url} alt={item.label} />
                : <div className="settings-item-placeholder">No image</div>
              }
            </div>
            <div className="settings-item-fields">
              <input
                className="settings-input"
                value={item.label}
                onChange={e => update(i, 'label', e.target.value)}
                placeholder="Label"
              />
              <div className="settings-row">
                <input
                  className="settings-input settings-input--url"
                  value={item.url}
                  onChange={e => update(i, 'url', e.target.value)}
                  placeholder="Image URL"
                />
                <label className="settings-upload-btn">
                  {uploading === i ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={el => fileRefs.current[i] = el}
                    onChange={e => e.target.files[0] && onUpload(i, e.target.files[0])}
                  />
                </label>
              </div>
              <select
                className="settings-select"
                value={item.size}
                onChange={e => update(i, 'size', e.target.value)}
              >
                <option value="large">Large (2×2)</option>
                <option value="medium">Medium (2×1)</option>
                <option value="small">Small (1×1)</option>
              </select>
            </div>
            <div className="settings-item-controls">
              <Toggle value={!item.hidden} onChange={v => update(i, 'hidden', !v)} />
              <ReorderBtns i={i} total={items.length} onMove={onMove} />
              <button className="settings-icon-btn settings-icon-btn--danger" onClick={() => onDelete(i)} title="Delete"><IconTrash /></button>
            </div>
          </div>
        ))}
      </div>

      <SaveBar onSave={onSave} saving={saving} saved={saved} />
    </div>
  );
}

// ── Videos Tab ────────────────────────────────────────────────────────────────

function VideosTab() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getVideos().then(setItems).catch(() => {});
  }, []);

  const update = (i, key, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  const onMove = (i, dir) => setItems(prev => move(prev, i, dir));
  const onDelete = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const onAdd = () => {
    setItems(prev => [...prev, { id: newId(), url: '', title: 'New Video', views: '', duration: '', hidden: false }]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await saveVideos(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Save failed. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  const ytThumb = (url) => {
    const m = url?.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
  };

  return (
    <div className="settings-tab-content">
      <div className="settings-tab-header">
        <p className="settings-tab-eyebrow">Visual Journey</p>
        <h2 className="settings-tab-title">Videos</h2>
        <div className="settings-tab-divider" />
        <div className="settings-tab-actions">
          <span />
          <button className="settings-add-btn" onClick={onAdd}><IconPlus /> Add Video</button>
        </div>
      </div>

      <div className="settings-list">
        {items.map((item, i) => {
          const thumb = ytThumb(item.url);
          return (
            <div className={`settings-item ${item.hidden ? 'settings-item--hidden' : ''}`} key={item.id}>
              <div className="settings-item-thumb settings-item-thumb--video">
                {thumb
                  ? <img src={thumb} alt={item.title} />
                  : <div className="settings-item-placeholder">▶</div>
                }
              </div>
              <div className="settings-item-fields">
                <input className="settings-input settings-input--title" value={item.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Video title" />
                <input className="settings-input settings-input--url" value={item.url} onChange={e => update(i, 'url', e.target.value)} placeholder="YouTube URL (https://youtube.com/watch?v=...)" />
                <div className="settings-row">
                  <input className="settings-input" value={item.views} onChange={e => update(i, 'views', e.target.value)} placeholder="Views (e.g. 2.4M views)" style={{ flex: 1 }} />
                  <input className="settings-input" value={item.duration} onChange={e => update(i, 'duration', e.target.value)} placeholder="Duration (e.g. 4:32)" style={{ width: 90 }} />
                </div>
              </div>
              <div className="settings-item-controls">
                <Toggle value={!item.hidden} onChange={v => update(i, 'hidden', !v)} />
                <ReorderBtns i={i} total={items.length} onMove={onMove} />
                <button className="settings-icon-btn settings-icon-btn--danger" onClick={() => onDelete(i)} title="Delete"><IconTrash /></button>
              </div>
            </div>
          );
        })}
      </div>

      <SaveBar onSave={onSave} saving={saving} saved={saved} />
    </div>
  );
}

// ── News Tab ──────────────────────────────────────────────────────────────────

const NEWS_TAGS = ['New Release', 'Milestone', 'Event', 'Announcement', 'Feature'];

function NewsTab() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getNews().then(setItems).catch(() => {});
  }, []);

  const update = (i, key, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  const onMove = (i, dir) => setItems(prev => move(prev, i, dir));
  const onDelete = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const onAdd = () => setItems(prev => [...prev, {
    id: newId(), date: new Date().getFullYear().toString(), tag: 'Announcement',
    title: 'New Update', excerpt: '', link: '', linkLabel: 'Read more', hidden: false,
  }]);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveNews(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Save failed. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-tab-content">
      <div className="settings-tab-header">
        <p className="settings-tab-eyebrow">Latest Updates</p>
        <h2 className="settings-tab-title">News &amp; Updates</h2>
        <div className="settings-tab-divider" />
        <div className="settings-tab-actions">
          <span />
          <button className="settings-add-btn" onClick={onAdd}><IconPlus /> Add Article</button>
        </div>
      </div>

      <div className="settings-list settings-list--news">
        {items.map((item, i) => (
          <div className={`settings-item settings-item--news ${item.hidden ? 'settings-item--hidden' : ''}`} key={item.id}>
            <div className="settings-item-fields">
              <div className="settings-row">
                <select className="settings-select" value={item.tag} onChange={e => update(i, 'tag', e.target.value)}>
                  {NEWS_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input className="settings-input" value={item.date} onChange={e => update(i, 'date', e.target.value)} placeholder="Year" style={{ width: 80 }} />
              </div>
              <input className="settings-input settings-input--title" value={item.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Headline" />
              <textarea className="settings-textarea" value={item.excerpt} onChange={e => update(i, 'excerpt', e.target.value)} placeholder="Short excerpt…" rows={3} />
              <div className="settings-row">
                <input className="settings-input settings-input--url" value={item.link} onChange={e => update(i, 'link', e.target.value)} placeholder="Link URL" style={{ flex: 1 }} />
                <input className="settings-input" value={item.linkLabel} onChange={e => update(i, 'linkLabel', e.target.value)} placeholder="Link text" style={{ width: 130 }} />
              </div>
            </div>
            <div className="settings-item-controls settings-item-controls--top">
              <Toggle value={!item.hidden} onChange={v => update(i, 'hidden', !v)} />
              <ReorderBtns i={i} total={items.length} onMove={onMove} />
              <button className="settings-icon-btn settings-icon-btn--danger" onClick={() => onDelete(i)} title="Delete"><IconTrash /></button>
            </div>
          </div>
        ))}
      </div>

      <SaveBar onSave={onSave} saving={saving} saved={saved} />
    </div>
  );
}

// ── Music Tab ─────────────────────────────────────────────────────────────────

function MusicTab() {
  const [tracks, setTracks] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noSpotify, setNoSpotify] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchLatestReleases(10).catch(() => null),
      getMusicOverrides().catch(() => []),
    ]).then(([spotifyTracks, storedOverrides]) => {
      if (!spotifyTracks) setNoSpotify(true);
      else setTracks(spotifyTracks);
      setOverrides(storedOverrides);
      setLoading(false);
    });
  }, []);

  const getOverride = (id) => overrides.find(o => o.spotifyId === id) || { spotifyId: id, hidden: false, order: null };

  const setOverride = (id, key, val) => {
    setOverrides(prev => {
      const existing = prev.find(o => o.spotifyId === id);
      if (existing) return prev.map(o => o.spotifyId === id ? { ...o, [key]: val } : o);
      return [...prev, { spotifyId: id, hidden: false, order: null, [key]: val }];
    });
  };

  // Build ordered list: apply stored order
  const ordered = [...tracks].sort((a, b) => {
    const oa = getOverride(a.id).order;
    const ob = getOverride(b.id).order;
    if (oa !== null && ob !== null) return oa - ob;
    if (oa !== null) return -1;
    if (ob !== null) return 1;
    return 0;
  });

  const onMove = (i, dir) => {
    const reordered = move(ordered, i, dir);
    setOverrides(prev => {
      const next = [...prev];
      reordered.forEach((t, idx) => {
        const existing = next.find(o => o.spotifyId === t.id);
        if (existing) existing.order = idx;
        else next.push({ spotifyId: t.id, hidden: false, order: idx });
      });
      return next;
    });
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await saveMusicOverrides(overrides);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Save failed. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="settings-tab-content"><p className="settings-loading">Loading…</p></div>;

  return (
    <div className="settings-tab-content">
      <div className="settings-tab-header">
        <p className="settings-tab-eyebrow">Our Productions</p>
        <h2 className="settings-tab-title">Our Music</h2>
        <div className="settings-tab-divider" />
        <div className="settings-tab-actions">
          <span className="settings-tab-note">Releases pulled from Spotify · reorder and hide tracks</span>
          <span />
        </div>
      </div>

      {noSpotify && (
        <div className="settings-notice">
          Spotify credentials not configured — add <code>REACT_APP_SPOTIFY_CLIENT_ID</code> and <code>REACT_APP_SPOTIFY_CLIENT_SECRET</code> to <code>.env.local</code> to manage live releases.
        </div>
      )}

      {!noSpotify && (
        <div className="settings-list">
          {ordered.map((track, i) => {
            const ov = getOverride(track.id);
            return (
              <div className={`settings-item ${ov.hidden ? 'settings-item--hidden' : ''}`} key={track.id}>
                <div className="settings-item-thumb">
                  {track.cover
                    ? <img src={track.cover} alt={track.title} />
                    : <div className="settings-item-placeholder">♪</div>
                  }
                </div>
                <div className="settings-item-fields">
                  <p className="settings-item-title">{track.title}</p>
                  <p className="settings-item-meta">{track.releaseYear} · <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">Open on Spotify</a></p>
                </div>
                <div className="settings-item-controls">
                  <Toggle value={!ov.hidden} onChange={v => setOverride(track.id, 'hidden', !v)} />
                  <ReorderBtns i={i} total={ordered.length} onMove={onMove} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SaveBar onSave={onSave} saving={saving} saved={saved} />
    </div>
  );
}

// ── Group Photo Tab ───────────────────────────────────────────────────────────

function GroupPhotoTab() {
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getGroupPhoto().then(d => setUrl(d.url || '')).catch(() => {});
  }, []);

  const onUpload = async (file) => {
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      setUrl(uploaded);
    } catch {
      alert('Upload failed. Check that the backend server is running.');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await saveGroupPhoto({ url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Save failed. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-tab-content">
      <div className="settings-tab-header">
        <p className="settings-tab-eyebrow">Our Story</p>
        <h2 className="settings-tab-title">Group Photo</h2>
        <div className="settings-tab-divider" />
        <p className="settings-tab-note">The hero image shown in the "Our Story" section — landscape 16:9 recommended.</p>
      </div>

      <div className="settings-group-photo">
        <div className="settings-group-preview">
          {url
            ? <img src={url} alt="Group" />
            : <div className="settings-group-placeholder">No photo set — using placeholder</div>
          }
        </div>
        <div className="settings-group-fields">
          <label className="settings-field-label">Photo URL</label>
          <input
            className="settings-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://…"
          />
          <label className="settings-upload-btn settings-upload-btn--full">
            {uploading ? 'Uploading…' : 'Upload from device'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && onUpload(e.target.files[0])} />
          </label>
          <p className="settings-hint">Recommended: landscape photo, 16:9 ratio, min 1600×900px</p>
        </div>
      </div>

      <SaveBar onSave={onSave} saving={saving} saved={saved} />
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────

const TABS = [
  { id: 'gallery', label: 'Gallery Photos' },
  { id: 'videos',  label: 'Videos' },
  { id: 'news',    label: 'News & Updates' },
  { id: 'music',   label: 'Our Music' },
  { id: 'photo',   label: 'Group Photo' },
];

export default function Settings() {
  const { isAdmin, checking, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gallery');

  useEffect(() => {
    if (!checking && !isAdmin) navigate('/login');
  }, [isAdmin, checking, navigate]);

  if (checking) return <div className="settings-loading-page">Verifying…</div>;
  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <a href="/" className="settings-logo">
          <img src="/men-aloho-logo.jpg" alt="Men Aloho" />
          <span>Men Aloho</span>
        </a>
        <p className="settings-logo-sub">Admin</p>
        <div className="settings-sidebar-divider" />
        <p className="settings-sidebar-label">Content</p>
        <nav className="settings-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`settings-nav-item ${activeTab === t.id ? 'settings-nav-item--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="settings-sidebar-footer">
          <a href="/" className="settings-site-link">← View site</a>
          <button className="settings-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="settings-main">
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'videos'  && <VideosTab />}
        {activeTab === 'news'    && <NewsTab />}
        {activeTab === 'music'   && <MusicTab />}
        {activeTab === 'photo'   && <GroupPhotoTab />}
      </main>
    </div>
  );
}
