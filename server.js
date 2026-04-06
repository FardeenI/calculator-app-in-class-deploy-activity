const path = require('path');
const express = require('express');
const cors = require('cors');
const { calculate } = require('./calculate');

const app = express();
app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.post('/calculate', (req, res) => {
  const { expression } = req.body || {};
  if (typeof expression !== 'string') return res.status(400).json({ error: 'expression required' });
  try {
    const result = calculate(expression);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Calculator app listening on http://localhost:${PORT}`));
