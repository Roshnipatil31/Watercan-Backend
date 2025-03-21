const axios = require("axios");
require("dotenv").config();

const sendMessageToWhatsApp = async (to, body) => {
    try {
        console.log(`Simulated Sending Message to ${to}: ${body}`);

        // Uncomment the code below if you want to send actual messages
        /*
        const response = await axios.post(
            "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages",
            {
                messaging_product: "whatsapp",
                to: to,
                text: { body: body }
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Message sent:", response.data);
        */

        return { success: true, message: "Message sent (Simulation)" };
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendMessageToWhatsApp };
