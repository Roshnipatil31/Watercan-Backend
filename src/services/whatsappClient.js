// ✅ Handle Incoming WhatsApp Messages
const Message = require("../model/whatsappModel");
const extractUserDetails = require("./extractDetails");
const { getNextStep } = require("../services/botFlow");
const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;


const userSession = {}; // Temporary user session storage

const handleIncomingMessage = async (client, msg) => {
    const from = msg.from;
    const body = msg.body.trim();

    console.log(`📩 Received message from ${from}: ${body}`);

    if (body.toLowerCase() === "hi") {
        userSession[from] = { step: "start" }; // Reset session
        const nextStepData = getNextStep("start");
        if (nextStepData) {
            await sendMessage(client, from, nextStepData.message);
        }
    } else if (userSession[from]?.step === "confirmDetails") {
        if (body === "1️⃣" || body.toLowerCase() === "yes") {
            userSession[from].step = "askCans";
            await sendMessage(client, from, "🛒 How many cans would you like to order?");
        } else if (body === "2️⃣" || body.toLowerCase() === "no") {
            userSession[from].step = "start";
            await sendMessage(client, from, "🔄 Please enter your details again:\n\nName: John Doe\nMobile: 9876543210\nAddress: 123 Main Street");
        } else {
            await sendMessage(client, from, "❌ Invalid response. Please reply with 1️⃣ Yes or 2️⃣ No.");
        }
    } else if (userSession[from]?.step === "askCans") {
        const numCans = parseInt(body, 10);
        if (!isNaN(numCans) && numCans > 0) {
            userSession[from].numCans = numCans;
            userSession[from].step = "askSchedule";
            await sendMessage(client, from, "⏰ Choose a delivery time slot:\n1️⃣ 9:00 AM - 10:00 AM\n2️⃣ 10:00 AM - 11:00 AM\n3️⃣ 11:00 AM - 12:00 PM\n4️⃣ 12:00 PM - 1:00 PM\n5️⃣ 1:00 PM - 2:00 PM\n6️⃣ 2:00 PM - 3:00 PM\n7️⃣ 3:00 PM - 4:00 PM\n8️⃣ 4:00 PM - 5:00 PM");
        } else {
            await sendMessage(client, from, "❌ Invalid number. Please enter a valid quantity.");
        }
    } else if (userSession[from]?.step === "askSchedule") {
        const timeSlots = {
            "1": "9:00 AM - 10:00 AM",
            "2": "10:00 AM - 11:00 AM",
            "3": "11:00 AM - 12:00 PM",
            "4": "12:00 PM - 1:00 PM",
            "5": "1:00 PM - 2:00 PM",
            "6": "2:00 PM - 3:00 PM",
            "7": "3:00 PM - 4:00 PM",
            "8": "4:00 PM - 5:00 PM",
            "1️⃣": "9:00 AM - 10:00 AM",
            "2️⃣": "10:00 AM - 11:00 AM",
            "3️⃣": "11:00 AM - 12:00 PM",
            "4️⃣": "12:00 PM - 1:00 PM",
            "5️⃣": "1:00 PM - 2:00 PM",
            "6️⃣": "2:00 PM - 3:00 PM",
            "7️⃣": "3:00 PM - 4:00 PM",
            "8️⃣": "4:00 PM - 5:00 PM"
        };
    
        // Convert emoji input to number if needed
        const convertEmojiToNumber = (input) => {
            const emojiMap = {
                "1️⃣": "1", "2️⃣": "2", "3️⃣": "3", "4️⃣": "4",
                "5️⃣": "5", "6️⃣": "6", "7️⃣": "7", "8️⃣": "8"
            };
            return emojiMap[input] || input; // If not an emoji, return as-is
        };
    
        const userSelection = convertEmojiToNumber(body);
    
        if (timeSlots[userSelection]) {
            userSession[from].deliveryTime = timeSlots[userSelection];
            userSession[from].step = "completed";



            // Save the order to MongoDB
            try {
await Message.create({
    from: from,
    name: userSession[from].name || "Unknown",
    phoneNumber: userSession[from].mobile || "Unknown",
    address: userSession[from].address || "Unknown",
    no_of_cans: userSession[from].numCans || 0,
    delivery_time: userSession[from].deliveryTime || "Not specified",
    body: `Order placed by ${userSession[from].name || "Unknown"}`
});


                console.log("✅ Order saved to MongoDB");

                // Send confirmation message
                await sendMessage(client, from, `✅ Your order has been recorded!\n\n🚰 Order Details:\n👤 Name: ${userSession[from].name}\n📞 Mobile: ${userSession[from].mobile}\n📍 Address: ${userSession[from].address}\n🛒 No. of Cans: ${userSession[from].numCans}\n⏰ Delivery Time: ${userSession[from].deliveryTime}\n\nThanks for ordering! 🚚💧`);
            } catch (error) {
                console.error("❌ Error saving order to MongoDB:", error);
                await sendMessage(client, from, "⚠️ There was an error saving your order. Please try again.");
            }
        } else {
            await sendMessage(client, from, "❌ Invalid selection. Please choose a valid time slot.");
        }
    } else {
        const userDetails = extractUserDetails(body);

        if (userDetails.name && userDetails.mobile && userDetails.address) {
            userSession[from] = { ...userDetails, step: "confirmDetails" };

            const confirmMessage = `✅ We received your details:\n👤 Name: ${userDetails.name}\n📞 Mobile: ${userDetails.mobile}\n📍 Address: ${userDetails.address}\n\nWould you like to proceed?\n1️⃣ Yes\n2️⃣ No, update details`;

            await sendMessage(client, from, confirmMessage);
        } else {
            await sendMessage(client, from, "❌ Invalid format. Please enter your details in the format:\nName: John Doe\nMobile: 9876543210\nAddress: 123 Main Street, City");
        }
    }
};

// ✅ Function to Send a WhatsApp Message
const sendMessage = async (to, message) => {
  try {
    await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Message sent to ${to}: ${message}`);
  } catch (error) {
    console.error("❌ Failed to send message:", error.response?.data || error.message);
  }
};

module.exports = { handleIncomingMessage, sendMessage };
