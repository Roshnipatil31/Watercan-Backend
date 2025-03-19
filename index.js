require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbconfig');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware (e.g. body parser)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api/watercan', require('./src/routes/watercanRoutes'));
app.use('/api/vendorapplication', require('./src/routes/vendorapplicationRoutes'));

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});