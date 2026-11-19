const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS само за собствените домейни (само едно извикване, преди статичните файлове и лимита)
app.use(cors({
  origin: ['https://oblako17.online', 'https://www.oblako17.online'],
  methods: ['GET', 'POST'],
}));
app.use(helmet());

const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));


// SPA fallback: връща index.html за всички непознати пътища (винаги най-отдолу!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 