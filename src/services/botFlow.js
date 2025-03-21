const botFlow = {
    start: {
        message: "👋 Welcome to Super Water World! Please share your name, mobile number, and current location.",
        next: "check_user"
    },
    check_user: {
        message: "🔍 Checking your details...",
        next: (userData) => userData ? "confirm_details" : "register"
    },
    register: {
        message: `📍 Please confirm your details:
1️⃣ Name
2️⃣ Mobile Number (example: 9876543210)
3️⃣ Address (Current Location)
4️⃣ Register if new user`,
        next: "select_quantity"
    },
    confirm_details: {
        message: (userData) => `✅ We found your details:
👤 Name: ${userData.name}
📞 Mobile: ${userData.mobile}
📍 Address: ${userData.address}

Would you like to proceed with the same details?
1️⃣ Yes
2️⃣ No, update details`,
        next: {
            "1": "select_quantity",
            "2": "register"
        }
    },
    select_quantity: {
        message: "💧 Select the number of water cans you need (e.g., 3 Cans).",
        next: "select_time"
    },
    select_time: {
        message: (currentTime) => {
            let availableSlots = [];
            let startHour = 9;
            let endHour = 21;
            let now = new Date();
            let currentHour = now.getHours();
            let minStartHour = currentHour + 2;
            
            for (let hour = Math.max(startHour, minStartHour); hour < endHour; hour++) {
                availableSlots.push(`${hour}:00 - ${hour + 1}:00`);
            }
            
            return `⏰ Select a time slot for delivery:\n` +
                   availableSlots.map((slot, index) => `${index + 1}️⃣ ${slot}`).join("\n");
        },
        next: "select_vendor"
    },
    select_vendor: {
        message: "🚚 Finding available vendors based on your location and selected time slot...",
        next: "order_confirmation"
    },
    order_confirmation: {
        message: "✅ Order placed successfully! Please be available at your selected time.",
        next: "order_status"
    },
    order_status: {
        message: `📦 Order confirmed. You can track your order status here:
1️⃣ Order in Progress
2️⃣ Order Completed`,
        next: "order_delivery"
    },
    order_delivery: {
        message: "🚚 Order delivered successfully! Please provide feedback.",
        next: "feedback"
    },
    feedback: {
        message: "💬 Thank you for your valuable feedback! Reply with '📩' to place another order.",
        next: "start"
    },
    exit: {
        message: "👋 Thank you for using Super Water World! Have a great day!"
    }
};

const getNextStep = (currentStep, userInput, userData, currentTime) => {
    if (!botFlow[currentStep]) return botFlow.start;

    const nextStep = botFlow[currentStep].next;

    if (typeof nextStep === "function") {
        return botFlow[nextStep(currentTime)];
    }

    if (typeof nextStep === "string") {
        return botFlow[nextStep];
    }

    if (typeof nextStep === "object" && nextStep[userInput]) {
        return botFlow[nextStep[userInput]];
    }

    return botFlow.start;
};

module.exports = { botFlow, getNextStep };
