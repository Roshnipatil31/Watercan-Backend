// user controller
const User = require("../model/userModel");
exports.createUSer = async (req, res) => {
    try {
        const { name, email, role, address, phoneNumber,user_id } = req.body;
        if (role == "admin") {
            const user = await User.create({ name, email, role ,user_id});
            res.status(201).json({ message: "admin created successfully", data: user });
        } else if (role == "vendor") {
            const user = await User.create({ name, email, role, phoneNumber,user_id });
            res.status(201).json({ message: "vendor created successfully", data: user });
        } else if (role == "user") {
            const user = await User.create({ name, email, role, phoneNumber });
            res.status(201).json({ message: "user created successfully", data: user });
        } else {
            res.status(400).json({ message: "Invalid role" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }

}
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error: error.message });
    }
}