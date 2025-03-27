// user controller
const User = require("../model/userModel");
const admin = require("../../config/firebase");
const firebaseAuth = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const nodemailer = require("nodemailer");

if (firebaseAuth.apps.length === 0) {
    admin.initializeApp();
}  

require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

exports.createUSer = async (req, res) => {
    try {
        const { name, email, role, phoneNumber, user_id } = req.body;

        if (role == "admin") {
            const user = await User.create({ name, email, role, user_id });
            return res.status(201).json({ message: "admin created successfully", data: user });
        } 
        
        if (role == "vendor") {
            const user = await User.create({ name, email, role, phoneNumber, user_id });
            return res.status(201).json({ message: "vendor created successfully", data: user });
        } 
        
        if (role == "user") {
            // Fetch latest WhatsApp message from this phone number
            const latestMessage = await Message.findOne({ from: phoneNumber }).sort({ timestamp: -1 });

            // Extract data from WhatsApp message if available
            const userData = {
                name: latestMessage?.name || name,
                phoneNumber: latestMessage?.phoneNumber || phoneNumber,
                role: "user",
                user_id: user_id
            };

            const user = await User.create(userData);
            return res.status(201).json({ message: "user created successfully", data: user });
        } 
        
        res.status(400).json({ message: "Invalid role" });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const { user_id } = req.body; // Get user_id from request body

        const user = await User.findOne({ user_id }); // Find by user_id instead of _id

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const auth = getAuth();
        const resetLink = await auth.generatePasswordResetLink(email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
        });

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "Error sending password reset email", error: error.message });
    }
};

