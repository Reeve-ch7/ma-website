const ARTIST_ID = '3elVp9RS2s3wh9ao7x3Xsg';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

async function getAccessToken() {
  const id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function fetchLatestReleases(limit = 7) {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    `${API_BASE}/artists/${ARTIST_ID}/albums?include_groups=single,album&limit=${limit}&market=IN`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();

  return data.items.map(album => ({
    id: album.id,
    title: album.name,
    releaseYear: album.release_date?.split('-')[0] ?? '',
    cover: album.images[1]?.url ?? album.images[0]?.url ?? null,
    coverFull: album.images[0]?.url ?? null,
    spotifyUrl: album.external_urls.spotify,
  }));
}
