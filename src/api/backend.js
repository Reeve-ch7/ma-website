const BASE = 'http://localhost:5001';

function getToken() {
  return localStorage.getItem('ma-admin-token') || '';
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function apiLogin(passcode) {
  const res = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) throw new Error('Invalid passcode');
  return res.json();
}

export async function apiVerify() {
  try {
    const data = await apiFetch('/api/verify');
    return data.ok === true;
  } catch {
    return false;
  }
}

export const getGallery        = () => apiFetch('/api/gallery');
export const saveGallery       = (d) => apiFetch('/api/gallery',         { method: 'POST', body: JSON.stringify(d) });

export const getVideos         = () => apiFetch('/api/videos');
export const saveVideos        = (d) => apiFetch('/api/videos',          { method: 'POST', body: JSON.stringify(d) });

export const getNews           = () => apiFetch('/api/news');
export const saveNews          = (d) => apiFetch('/api/news',            { method: 'POST', body: JSON.stringify(d) });

export const getMusicOverrides = () => apiFetch('/api/music-overrides');
export const saveMusicOverrides= (d) => apiFetch('/api/music-overrides', { method: 'POST', body: JSON.stringify(d) });

export const getGroupPhoto     = () => apiFetch('/api/group-photo');
export const saveGroupPhoto    = (d) => apiFetch('/api/group-photo',     { method: 'POST', body: JSON.stringify(d) });

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  const { url } = await res.json();
  return url;
}
