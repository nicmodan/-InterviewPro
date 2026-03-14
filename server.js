// ============================================================
//  God's Celebrities — Node.js Server
//  Serves the /build folder as a static website
//  Run:  node server.js
//  Or:   npm start
// ============================================================

const express  = require('express');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Serve everything inside /build as static files ──────────
app.use(express.static(path.join(__dirname, 'build')));

// ── Catch-all: return index.html for any unknown route ──────
//    (allows deep-linking / page refresh to work cleanly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ✦  God\'s Celebrities is running');
  console.log(`  ✦  Open → http://localhost:${PORT}`);
  console.log('  ✦  Press Shift+A on the site to open Admin');
  console.log('  ✦  Stop  → Ctrl+C');
  console.log('');
});
