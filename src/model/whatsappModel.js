const mongoose = require("mongoose");

// Define the schema for storing WhatsApp messages
const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },  // Sender's WhatsApp number
    body: { type: String, required: true },  // Message content
    timestamp: { type: Date, default: Date.now } // Auto-generated timestamp
});

// Create a Mongoose model based on the schema
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
