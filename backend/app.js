const express = require('express');
const cors = require('cors');
const testDataRoutes = require('./routes/testDataRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// 🔥 Allow frontend origin here
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use(express.json());
app.use('/api/testdata', testDataRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
