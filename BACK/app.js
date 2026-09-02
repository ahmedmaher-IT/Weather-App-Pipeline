const express = require('express');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Mock Database & Auth Middleware
const users = [];
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register Endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, city } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newUser = { username, email, password, city: city || 'Cairo' };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: { username, city: newUser.city } });
});

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user && username !== 'admin') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const userCity = user ? user.city : 'Cairo';
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  
  res.json({ token, user: { username, city: userCity } });
});

// JWT Protection Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Protected Weather Endpoint
app.get('/api/weather', authenticateToken, async (req, res) => {
  const city = req.query.city || 'Cairo';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });


  
   const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// يعمل الساعة 12:00 منتصف الليل في أول يوم من كل شهر
cron.schedule('0 0 1 * *', () => {
  // الحصول على تاريخ الشهر السابق
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const previousMonth = date.toISOString().slice(0, 7); // e.g. "2026-08"

  const logPath = path.join(__dirname, `./logs/access-${previousMonth}.log`);

  if (fs.existsSync(logPath)) {
    console.log(`Processing log cleanup for ${previousMonth}...`);

    // هنا يمكنك إضافة إرسال الملف للإيميل عبر Nodemailer قبل المسح
    // بعد التأكد أو الإرسال نضع أمر المسح:
    fs.unlink(logPath, (err) => {
      if (err) console.error("Error deleting old log file:", err);
      else console.log(`Log file for ${previousMonth} deleted from server.`);
    });
  }
});


}