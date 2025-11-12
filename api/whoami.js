export default function handler(req, res) {
  res.status(200).json({
    ui_url: process.env.UI_URL || null,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || null,
    vercel_url: process.env.VERCEL_URL || null
  });
}
