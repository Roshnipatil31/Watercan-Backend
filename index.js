require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbconfig');
const cors = require('cors');
const messageRoutes = require("./src/routes/whatsappRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware (e.g. body parser)
app.use(express.json());
app.use(cors());

const userRoutes = require('./src/routes/userRoutes');
const watercanRoutes = require('./src/routes/watercanRoutes');
const vendorapplicationRoutes = require('./src/routes/vendorapplicationRoutes');

app.use('/watercan', watercanRoutes);
app.use('/vendorapplication',vendorapplicationRoutes);
app.use('/user', userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("🚀 WhatsApp Bot API is Running...");
});

// Listen
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
 });