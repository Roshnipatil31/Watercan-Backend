const Message = require("../model/whatsappModel");
const { getNextStep } = require("../services/botFlow");
const { sendMessageToWhatsApp } = require("../services/whatsappService");

const userSession = {}; // Store user session temporarily

const handleWebhook = async (req, res) => {
    try {
        const data = req.body;
        console.log("📩 Incoming Webhook Data:", JSON.stringify(data, null, 2));

        // Validate incoming webhook data structure
        const messageEntry = data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (!messageEntry || !messageEntry.text?.body) {
            return res.status(400).json({ error: "Invalid or missing message format in webhook" });
        }

        const from = messageEntry.from;
        const body = messageEntry.text.body.trim();

        console.log(`📩 Received: "${body}" from ${from}`);

        // Store message in MongoDB
        await Message.create({ from, body });

        // Reset session on "hi"
        if (body.toLowerCase() === "hi") {
            userSession[from] = { step: "start" }; // Reset session completely
        }

        const currentStep = userSession[from]?.step || "start";
        let nextStepData = getNextStep(currentStep, body);

        if (!nextStepData || !nextStepData.message) {
            return res.status(400).json({ error: "No valid response found for the next step" });
        }

        userSession[from] = { step: nextStepData.next || "start" };

        // Send response message to WhatsApp
        await sendMessageToWhatsApp(from, nextStepData.message);

        res.status(200).json({
            from,
            receivedMessages: body,
            botResponse: nextStepData.message,
            nextStep: userSession[from].step,
        });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { to, body } = req.body;

        if (!to || !body) {
            return res.status(400).json({ error: "Missing recipient number or message body" });
        }

        console.log(`📩 [TEST] Sending Message to ${to}: ${body}`);

        res.status(200).json({
            to,
            receivedMessage: body,
            botResponse: "Message sent successfully (Simulated)",
        });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Export the functions correctly
module.exports = { handleWebhook, sendMessage };
