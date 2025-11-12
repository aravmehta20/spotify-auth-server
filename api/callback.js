import querystring from 'querystring';
import fetch from 'node-fetch';
// vercel env var (Project → Settings → Environment Variables)
UI_URL=https://<your-username>.github.io/<your-repo>

// api/callback.js
import querystring from "querystring";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const code = req.query.code || null;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: "Basic " + Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const data = await tokenRes.json();
  res.redirect(`https://aravmehta20.github.io/spotifyplayer?access_token=${data.access_token}&refresh_token=${data.refresh_token}`);
  const data = await r.json();
  if (!data.access_token) {
    console.error("Token exchange failed:", data);
    return res.status(500).send("Token exchange failed");
  }

  const qs = querystring.stringify({
    access_token: data.access_token,
    refresh_token: data.refresh_token || "",
  });
  res.redirect(`${process.env.UI_URL}?${qs}`);
}
