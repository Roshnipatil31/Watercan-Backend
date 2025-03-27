const axios = require("axios");
require("dotenv").config();

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("❌ Missing WhatsApp API credentials in .env file");
    process.exit(1);
}

const sendMessageToWhatsApp = async (to, payload) => {
    try {
        console.log(`📩 Sending Message to ${to}:`, JSON.stringify(payload, null, 2));

        const url = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
        console.log(`🔍 API URL: ${url}`);

        const response = await axios.post(
            url,
            { messaging_product: "whatsapp", to, ...payload },
            {
                headers: {
                    "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Message sent:", response.data);
        return { success: true, message: "Message sent successfully", data: response.data };
    } catch (error) {
        console.error("❌ Error sending message:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

const checkWhatsAppToken = async () => {
    try {
        const response = await axios.get(
            `https://graph.facebook.com/v17.0/me?access_token=${WHATSAPP_ACCESS_TOKEN}`
        );

        if (response.data.id) {
            console.log("✅ WhatsApp API Token is valid.");
        } else {
            console.error("❌ Invalid WhatsApp API Token.");
        }
    } catch (error) {
        console.error("❌ Failed to validate WhatsApp API Token:", error.response?.data || error.message);
    }
};

module.exports = { sendMessageToWhatsApp, checkWhatsAppToken };
