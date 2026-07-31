import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useAdmin } from '../context/AdminContext';
import { fetchAnalytics, fetchActiveUsers } from '../lib/analyticsService';
import './Analytics.css';

const RANGES = [
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'this_year',  label: 'This Year'  },
  { key: 'all_time',   label: 'All Time'   },
];

const ACCENT = 'var(--gold)';

const TABS = ['Engagement', 'Geography', 'Audience'];

const axisStyle  = { fontSize: 11, fill: 'var(--text-faint)' };
const gridStroke = 'var(--border)';

function isEmpty(series, keys) {
  return series.every((d) => keys.every((k) => !d[k]));
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <div className="analytics-tooltip__label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color || ACCENT }}>
          {p.name}: <strong>{p.value ?? 0}</strong>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, total, totalLabel, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">{title}</span>
      </div>
      {total != null && (
        <div className="chart-card__metric">
          <span className="chart-card__metric-value">{total}</span>
          <span className="chart-card__metric-label">{totalLabel}</span>
        </div>
      )}
      <div className="chart-card__body">{children}</div>
    </div>
  );
}

function RankCard({ title, total, totalLabel, rows, keyProp, valueProp, emptyMsg }) {
  return (
    <div className="chart-card chart-card--list">
      <div className="chart-card__header">
        <span className="chart-card__title">{title}</span>
      </div>
      {total != null && (
        <div className="chart-card__metric">
          <span className="chart-card__metric-value">{total}</span>
          <span className="chart-card__metric-label">{totalLabel}</span>
        </div>
      )}
      <div className="chart-card__body">
        {!rows.length ? (
          <div className="chart-card__empty">{emptyMsg}</div>
        ) : (
          <ol className="rank-list">
            {rows.map((row, i) => {
              const max = rows[0][valueProp] || 1;
              const pct = Math.round((row[valueProp] / max) * 100);
              return (
                <li key={row[keyProp]} className="rank-list__row">
                  <span className="rank-list__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="rank-list__key" title={row[keyProp]}>{row[keyProp]}</span>
                  <span className="rank-list__bar-wrap">
                    <span className="rank-list__bar" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="rank-list__value">{row[valueProp]}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, total, totalLabel, stats }) {
  return (
    <div className="chart-card chart-card--stat">
      <div className="chart-card__header">
        <span className="chart-card__title">{title}</span>
      </div>
      {total != null && (
        <div className="chart-card__metric">
          <span className="chart-card__metric-value">{total}</span>
          <span className="chart-card__metric-label">{totalLabel}</span>
        </div>
      )}
      <div className="stat-card__body">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className="stat-card__item">
            <div className="stat-card__value" style={color ? { color } : {}}>{value}</div>
            <div className="stat-card__label">{label}</div>
            {sub && <div className="stat-card__sub">{sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { isAdmin, checking } = useAdmin();
  const navigate = useNavigate();

  const [range, setRange] = useState('this_month');
  const [tab, setTab] = useState('Engagement');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);

  useEffect(() => {
    if (!checking && !isAdmin) navigate('/login');
  }, [isAdmin, checking, navigate]);

  const load = useCallback((r) => {
    setData(null);
    setLoading(true);
    setError(null);
    fetchAnalytics(r)
      .then(setData)
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAdmin) load(range);
  }, [range, load, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const poll = () => fetchActiveUsers().then((d) => setActiveUsers(d.active_users ?? null));
    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, [isAdmin]);

  if (checking) return <div className="settings-loading-page">Verifying…</div>;
  if (!isAdmin) return null;

  const topPages    = data?.top_pages          ?? [];
  const hourly      = data?.hourly_visits      ?? [];
  const visits      = data?.page_visits        ?? [];
  const sources     = data?.traffic_sources    ?? [];
  const deviceSplit = data?.device_split       ?? {};
  const sessionDepth = data?.session_depth     ?? {};
  const visitorType = data?.visitor_type       ?? {};
  const timezones   = data?.timezones          ?? [];
  const languages   = data?.languages          ?? [];
  const oses        = data?.operating_systems  ?? [];
  const browsers    = data?.browsers           ?? [];
  const countries   = data?.countries          ?? [];
  const cities      = data?.cities             ?? [];

  const totalVisits = visits.reduce((s, d) => s + d.count, 0);

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <a href="/" className="analytics-logo">
          <img src="/men-aloho-logo.jpg" alt="Men Aloho" />
          <span>Men Aloho</span>
        </a>
        <div className="analytics-header-right">
          <a href="/settings" className="analytics-link">← Settings</a>
        </div>
      </header>

      <main className="analytics-main">
        <p className="analytics-eyebrow">Admin</p>
        <h1 className="analytics-title">Analytics</h1>
        <div className="analytics-divider" />

        <div className="analytics-controls">
          <div className="analytics-range-picker">
            {RANGES.map(({ key, label }) => (
              <button
                key={key}
                className={`analytics-range-picker__btn${range === key ? ' analytics-range-picker__btn--active' : ''}`}
                onClick={() => setRange(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="active-users-card">
            <span className={`active-users-card__dot${activeUsers ? ' active-users-card__dot--live' : ''}`} />
            <span className="active-users-card__count">{activeUsers == null ? '–' : activeUsers}</span>
            <span className="active-users-card__label">
              {activeUsers === 1 ? 'person' : 'people'} on the site right now
            </span>
          </div>
        </div>

        <div className="analytics-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`analytics-tabs__btn${tab === t ? ' analytics-tabs__btn--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="analytics-loading">
            <div className="analytics-loading__spinner" />
            Loading…
          </div>
        )}

        {error && !loading && <p className="analytics-error">{error}</p>}

        {!loading && data && (
          <div className="analytics-charts-grid">

            {tab === 'Engagement' && <>
              <ChartCard title="Page Visits" total={totalVisits} totalLabel={totalVisits === 1 ? 'visit' : 'visits'}>
                {isEmpty(visits, ['count']) ? (
                  <div className="chart-card__empty">No visits recorded yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visits} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<TooltipBox />} />
                      <Line dataKey="count" name="Visits" type="monotone" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 3.5, fill: ACCENT, strokeWidth: 0 }} activeDot={{ r: 5.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <RankCard
                title="Top Pages"
                total={topPages.reduce((s, r) => s + r.count, 0)}
                totalLabel="total views"
                rows={topPages}
                keyProp="page"
                valueProp="count"
                emptyMsg="No page visits recorded yet"
              />

              <ChartCard title="Visits by Hour" totalLabel="local time">
                {isEmpty(hourly, ['count']) ? (
                  <div className="chart-card__empty">No visits recorded yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" tick={axisStyle} tickLine={false} axisLine={false} interval={5} />
                      <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<TooltipBox />} />
                      <Bar dataKey="count" name="Visits" radius={[3, 3, 0, 0]}>
                        {hourly.map((h) => (
                          <Cell key={h.hour} fill={ACCENT} fillOpacity={0.3 + 0.7 * (h.count / (Math.max(...hourly.map(x => x.count)) || 1))} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <StatCard
                title="New vs Returning"
                total={visitorType.total ?? 0}
                totalLabel="total visits"
                stats={[
                  { label: 'New', value: visitorType.new ?? 0 },
                  { label: 'Returning', value: visitorType.returning ?? 0 },
                  ...((visitorType.total ?? 0) > 0 ? [{
                    label: 'Return rate',
                    value: `${Math.round(((visitorType.returning ?? 0) / visitorType.total) * 100)}%`,
                  }] : []),
                ]}
              />

              <StatCard
                title="Session Depth"
                stats={[
                  {
                    label: 'Single-page', value: sessionDepth.bounced ?? 0,
                    sub: (sessionDepth.bounced || sessionDepth.engaged)
                      ? `${Math.round((sessionDepth.bounced ?? 0) / ((sessionDepth.bounced ?? 0) + (sessionDepth.engaged ?? 0)) * 100)}% bounce`
                      : null,
                    color: 'var(--text-faint)',
                  },
                  {
                    label: 'Multi-page', value: sessionDepth.engaged ?? 0,
                    sub: (sessionDepth.bounced || sessionDepth.engaged)
                      ? `${Math.round((sessionDepth.engaged ?? 0) / ((sessionDepth.bounced ?? 0) + (sessionDepth.engaged ?? 0)) * 100)}% engaged`
                      : null,
                    color: 'var(--gold)',
                  },
                ]}
              />
            </>}

            {tab === 'Geography' && <>
              <RankCard title="Countries" total={countries.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={countries} keyProp="label" valueProp="count" emptyMsg="No geo data yet, accumulates as visitors arrive" />
              <RankCard title="Cities" total={cities.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={cities} keyProp="label" valueProp="count" emptyMsg="No geo data yet, accumulates as visitors arrive" />
              <RankCard title="Traffic Sources" total={sources.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={sources} keyProp="source" valueProp="count" emptyMsg="No referrer data yet, accumulates as visitors arrive" />
              <RankCard title="Timezones" total={timezones.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={timezones} keyProp="label" valueProp="count" emptyMsg="No timezone data yet" />
            </>}

            {tab === 'Audience' && <>
              <RankCard title="Languages" total={languages.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={languages} keyProp="label" valueProp="count" emptyMsg="No language data yet" />
              <RankCard title="Operating Systems" total={oses.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={oses} keyProp="label" valueProp="count" emptyMsg="No OS data yet" />
              <RankCard title="Browsers" total={browsers.reduce((s, r) => s + r.count, 0)} totalLabel="tracked visits" rows={browsers} keyProp="label" valueProp="count" emptyMsg="No browser data yet" />
              <StatCard
                title="Device Split"
                stats={[
                  {
                    label: 'Desktop', value: deviceSplit.desktop ?? 0,
                    sub: deviceSplit.desktop && (deviceSplit.desktop + (deviceSplit.mobile ?? 0))
                      ? `${Math.round(deviceSplit.desktop / (deviceSplit.desktop + (deviceSplit.mobile ?? 0)) * 100)}%`
                      : null,
                  },
                  {
                    label: 'Mobile', value: deviceSplit.mobile ?? 0,
                    sub: deviceSplit.mobile && ((deviceSplit.desktop ?? 0) + deviceSplit.mobile)
                      ? `${Math.round(deviceSplit.mobile / ((deviceSplit.desktop ?? 0) + deviceSplit.mobile) * 100)}%`
                      : null,
                  },
                ]}
              />
            </>}

          </div>
        )}
      </main>
    </div>
  );
}
