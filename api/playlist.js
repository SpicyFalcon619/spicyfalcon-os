// Vercel serverless function: returns the Spicetify playlist as plain track data.
// The Spotify client secret stays here, on the server. Set these in Vercel
// (Project Settings, Environment Variables), without the VITE_ prefix so Vite
// never puts them into the browser bundle:
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_PLAYLIST_ID

let cached = { at: 0, tracks: null };
const ONE_HOUR = 60 * 60 * 1000;

export default async function handler(req, res) {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_PLAYLIST_ID: playlist } = process.env;
  if (!id || !secret || !playlist) {
    return res.status(503).json({ error: 'Spotify is not configured on the server.' });
  }

  if (cached.tracks && Date.now() - cached.at < ONE_HOUR) {
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ tracks: cached.tracks });
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`);
    const { access_token: token } = await tokenRes.json();

    const plRes = await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlist)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!plRes.ok) throw new Error(`playlist ${plRes.status}`);
    const data = await plRes.json();

    const tracks = data.tracks.items
      .filter((item) => item.track)
      .map(({ track }) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url ?? null,
        previewUrl: track.preview_url,
        duration: track.duration_ms,
        spotifyUrl: track.external_urls.spotify,
      }));

    cached = { at: Date.now(), tracks };
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ tracks });
  } catch (err) {
    // Never echo Spotify's response body: it can contain request details.
    return res.status(502).json({ error: 'Spotify request failed.', detail: String(err.message).slice(0, 40) });
  }
}
