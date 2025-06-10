const express = require('express');
const cors = require('cors');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingsRouter);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend działa!' });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});