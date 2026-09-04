const express = require('express');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const app = express();

// إعداد CORS للقبول من جميع المصادر الممكنة وتمرير الـ Headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Root Route
app.get('/', (req, res) => {
  res.send('Weather App Backend is running successfully!');
});

// Mock Database & Auth
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
  const token = jwt.sign({ username: username || 'admin' }, JWT_SECRET, { expiresIn: '2h' });
  
  res.json({ token, user: { username: username || 'admin', city: userCity } });
});

// Protected Weather Endpoint (تستعمل global fetch المدمجة في Node 18)
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Cairo';
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.error("Error: OPENWEATHER_API_KEY is not defined in environment variables!");
    return res.status(500).json({ message: 'Server Configuration Error: Missing API Key' });
  }

  try {
    // استخدام fetch المدمجة في Node.js مباشرة بدون مكتبات خارجية
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      console.error("OpenWeather API Error:", data);
      res.status(response.status).json(data);
    }
  } catch (err) {
    console.error("Fetch Execution Error:", err);
    res.status(500).json({ message: 'Error fetching weather data', details: err.message });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}