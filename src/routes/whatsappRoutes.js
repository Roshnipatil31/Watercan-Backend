const express = require("express");
const router = express.Router();
const { handleIncomingMessage, sendMessage } = require("../services/whatsappClient");
require("dotenv").config();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// 📩 Handle Incoming WhatsApp Messages (POST Request)

// ✅ Webhook verification endpoint
router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified successfully!");
      return res.status(200).send(challenge);
    } else {
      console.error("❌ Verification failed. Invalid token.");
      console.log("response", res)
      return res.sendStatus(403);
    }
  });


router.post("/webhook", (req, res) => {
  try {
    console.log("📩 Incoming WhatsApp message:", JSON.stringify(req.body, null, 2));

    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || !message.from || !message.text?.body) {
      console.error("❌ Invalid message format:", req.body);
      return res.status(400).json({ success: false, error: "Invalid message format" });
    }

    const from = message.from;
    const body = message.text.body;

    handleIncomingMessage(from, body);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 📤 Send a WhatsApp Message via API
router.post("/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ success: false, error: "Missing 'to' or 'message' field" });
    }

    await sendMessage(to, message);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
});

module.exports = router;
