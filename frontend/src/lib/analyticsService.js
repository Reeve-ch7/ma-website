import { API_BASE, getToken } from '../api/backend';

// No-op on localhost — avoids polluting analytics during development.
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// No-op whenever an admin token is present, so the admin never pollutes their own analytics.
const isAdmin = () => !!getToken();
const shouldTrack = () => !isLocalhost && !isAdmin();

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const post = (path, body = {}) =>
  fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {}); // fire-and-forget, never throw

const SID_KEY = 'ma.sid';

const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return '';
  }
};

const getReferrer = () => {
  if (typeof document === 'undefined') return '';
  const ref = document.referrer;
  if (!ref) return '';
  try {
    if (new URL(ref).origin === window.location.origin) return ''; // same-site nav
    return ref;
  } catch {
    return '';
  }
};

const getDeviceType = () => {
  if (typeof window === 'undefined') return '';
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
};

const getTimezone = () => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
};

const getLanguage = () => {
  try { return navigator.language || ''; } catch { return ''; }
};

const VISITOR_KEY = 'ma.visitor';

const getIsReturning = () => {
  try {
    const seen = !!localStorage.getItem(VISITOR_KEY);
    if (!seen) localStorage.setItem(VISITOR_KEY, '1');
    return seen;
  } catch {
    return false;
  }
};

export const trackVisit = (page) => {
  if (!shouldTrack()) return;
  post('/api/analytics/visit', {
    page,
    session_id: getSessionId(),
    referrer: getReferrer(),
    device_type: getDeviceType(),
    timezone: getTimezone(),
    language: getLanguage(),
    is_returning: getIsReturning(),
  });
};

export const sendHeartbeat = () => {
  if (!shouldTrack()) return;
  const sessionId = getSessionId();
  if (sessionId) post('/api/analytics/heartbeat', { session_id: sessionId });
};

export const fetchActiveUsers = () =>
  fetch(`${API_BASE}/api/analytics/active-users`, {
    headers: authHeaders(),
    cache: 'no-store',
  }).then((r) => (r.ok ? r.json() : { active_users: null }));

export const fetchAnalytics = (range) =>
  fetch(`${API_BASE}/api/analytics/summary?range=${range}`, {
    headers: authHeaders(),
    cache: 'no-store',
  }).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  });
