# Men Aloho — Frontend

React SPA built with Create React App.

## Stack

- **React 19** with React Router DOM v7
- **Spotify Web API** — live release feed via `src/utils/spotify.js`
- **CSS custom properties** for theming (light/dark mode)

## Getting Started

```bash
npm install
npm start       # dev server at http://localhost:3000
npm run build   # production build → build/
```

Requires the backend running at `http://localhost:5001` for admin features. All sections fall back to hardcoded defaults if the backend is unreachable.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main site |
| `/login` | Admin login |
| `/settings` | Admin settings panel (requires auth) |

## Sections

| Component | Description |
|-----------|-------------|
| `Hero` | Full-screen landing with scroll indicator |
| `About` | Group photo + ensemble overview |
| `Gallery` | Masonry photo grid + YouTube videos |
| `Music` | Live Spotify releases with admin overrides |
| `News` | News & updates cards |
| `Concerts` | Upcoming performances |
| `Contact` | Contact form |

## Theming

Dark/light mode toggled via `[data-theme="dark"]` on `<html>`. All colours use CSS custom properties (`--bg`, `--gold`, `--card-bg`, etc.) defined in `App.css`.

## Admin

`AdminContext` manages auth state. The JWT token is stored in `localStorage` as `ma-admin-token`. The Settings link in the navbar is only visible when logged in.
