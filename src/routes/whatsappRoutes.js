const express = require("express");
const { handleWebhook, sendMessage } = require("../controller/whatsappController");

const router = express.Router();

// Webhook route for receiving WhatsApp messages (simulation)
router.post("/webhook", handleWebhook);

// Route to simulate sending a message
router.post("/send", sendMessage);

module.exports = router;
