// backend/app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const ruleRoutes = require('./routes/ruleRoutes');
// If you have user-related routes, include them here
// const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  // origin: 'http://localhost:5173', // Frontend URL (Adjust if different)
  origin: 'https://project-1-v-2-frontend-ashutoshpanda.onrender.com', // Frontend URL (Adjust if different)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/rules', ruleRoutes);
// app.use('/api/users', userRoutes); // Uncomment if applicable

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
