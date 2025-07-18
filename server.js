const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000; // Можеш да смениш порта ако искаш
const SECRET_PATH = '/my-secret-stats-12345'; // Смени с твой таен път
const VISITS_FILE = path.join(__dirname, 'visits.json');

app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max: 100,
  message: "To many requests, please try again later.",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: ['https://oblako17.online', 'https://www.oblako17.online'],
  methods: ['GET', 'POST'],
}));

app.use((req, res, next) => {
  const ua = req.get('user-agent') || '';
  if(/curl|wget|bot|spider|scraper/i.test(ua)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
});

// Записва всяко посещение
app.post('/track-visit', (req, res) => {
  const visit = {
    date: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || '',
    referrer: req.headers['referer'] || '',
  };

  let visits = [];
  if (fs.existsSync(VISITS_FILE)) {
    try {
      visits = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
    } catch (e) {
      visits = [];
    }
  }
  visits.push(visit);
  fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2));
  res.json({ ok: true });
});

// Достъп до статистиката само през таен URL
app.get(SECRET_PATH, (req, res) => {
  if (!fs.existsSync(VISITS_FILE)) {
    return res.json([]);
  }
  const visits = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
  res.json(visits);
});

// SPA fallback: връща index.html за всички непознати пътища
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Visit tracker server running on http://localhost:${PORT}`);
  console.log(`Stats available at http://localhost:${PORT}${SECRET_PATH}`);
}); 