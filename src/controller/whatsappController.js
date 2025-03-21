const Message = require("../model/whatsappModel");
 // ✅ Check if the correct path
const { getNextStep } = require("../services/botFlow");  
const { sendMessageToWhatsApp } = require("../services/whatsappService");

const userSession = {}; // Store user session temporarily

// ✅ Handle Incoming Messages (Webhook Simulation)
const handleWebhook = async (req, res) => {
    try {
        const data = req.body;
        if (!data.entry || !data.entry[0].changes[0].value.messages) {
            return res.status(400).json({ error: "Invalid webhook data" });
        }

        const messageEntry = data.entry[0].changes[0].value.messages[0];
        if (!messageEntry || !messageEntry.text) {
            return res.status(400).json({ error: "Invalid message format" });
        }

        const from = messageEntry.from;
        const body = messageEntry.text.body.trim();

        console.log(`📩 Received: ${body} from ${from}`);

        // Save message to database
        try {
            await Message.create({ from, body });
        } catch (saveError) {
            return res.status(500).json({ error: "Failed to save message" });
        }

        // Check or initialize user session step
        const currentStep = userSession[from] || "start";

        // Get next step based on bot flow
        const nextStepData = getNextStep(currentStep, body);

        // Store user’s new step correctly
        userSession[from] = typeof nextStepData.next === "string" ? nextStepData.next : "start";

        // Send bot response
        try {
            await sendMessageToWhatsApp(from, nextStepData.message);
        } catch (sendError) {
            return res.status(500).json({ error: "Failed to send message" });
        }

                res.status(200).json({
            from: from,
            receivedMessage: body,
            botResponse: nextStepData.message,
            nextStep: userSession[from]
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Simulated Send Message Function (for Testing via Postman)
const sendMessage = async (req, res) => {
    try {
        const { to, body } = req.body;

        if (!to || !body) {
            return res.status(400).json({ error: "Missing recipient number or message body" });
        }

        console.log(`📩 Simulated Sending Message to ${to}: ${body}`);

        res.status(200).json({
            from: from,
            receivedMessage: body,
            botResponse: nextStepData.message,
            nextStep: userSession[from]
        });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Export the functions correctly
module.exports = { handleWebhook, sendMessage };
