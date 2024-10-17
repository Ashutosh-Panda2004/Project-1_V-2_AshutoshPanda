const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ruleRoutes = require('./routes/ruleRoutes'); // Adjust the path if necessary

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/rules', ruleRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
