const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3003;

// Serve all static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all → always return index.html (handles page refresh / direct URLs)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✦  God's Celebrities running → http://localhost:${PORT}`);
});
