const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

if (fs.existsSync(distDir)) {
	app.use(express.static(distDir));
	app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));
} else {
	app.use(express.static(publicDir));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Calculator frontend serving at http://localhost:${PORT}`));
