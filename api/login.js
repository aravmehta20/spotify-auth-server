import fetch from 'node-fetch';

export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const scope = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state', // <-- needed for play/pause/next/prev
    'user-read-playback-state',
    'user-read-currently-playing'
  ].join(' ');

  const state = Math.random().toString(36).slice(2);
  const authUrl =
    `https://accounts.spotify.com/authorize?response_type=code` +
    `&client_id=${client_id}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&state=${state}` +
    `&show_dialog=true`; // <-- once, to refresh consent
  res.redirect(authUrl);
}

