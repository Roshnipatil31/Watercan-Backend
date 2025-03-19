require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbconfig');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware (e.g. body parser)
app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
const watercanRoutes = require('./src/routes/watercanRoutes');
const vendorapplicationRoutes = require('./src/routes/vendorapplicationRoutes');

app.use('/watercan', watercanRoutes);
app.use('vendorapplication',vendorapplicationRoutes);
app.use('/user', userRoutes);

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});