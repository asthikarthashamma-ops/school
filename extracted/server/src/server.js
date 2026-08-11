const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB successfully connected.');
    // Optional: Seed initial database state here if tables are empty.
  })
  .catch((err) => console.error('MongoDB connection failure:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Management API Server running.' });
});

// Serve static React client assets in production
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Wildcard routing to pass off pages rendering to React Router
app.get('*any', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
