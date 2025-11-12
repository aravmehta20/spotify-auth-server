export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send('Missing code');

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, UI_URL } = process.env;

    const body = new URLSearchParams({
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.access_token) {
      console.error('Token exchange failed', tokenRes.status, data);
      return res.status(502).send('Token exchange failed');
    }

    const qs = new URLSearchParams({
      access_token: data.access_token,
      refresh_token: data.refresh_token || '',
      src: 'gamma' // marker to verify which project handled the callback
    }).toString();

    console.log('Redirecting to UI_URL:', UI_URL);
    return res.redirect(`${UI_URL}?${qs}`);
  } catch (e) {
    console.error('Callback error', e);
    return res.status(500).send('Internal error');
  }
}
