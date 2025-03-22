const Watercan = require("../model/watercanModel");

const createWatercan = async (req, res) => {

    try {
        const { Brand, MRP, capacityInLiters, selling_price } = req.body;
        const watercan = await Watercan.create({ Brand, MRP, capacityInLiters, selling_price });
        res.status(201).json({ message: "watercan created successfully", data: watercan });
    } catch (error) {
        res.status(500).json({ message: "Error creating watercan", error: error.message });
    }
}

const getAllWatercan = async (req, res) => {
    try {
        const watercan = await Watercan.find();
        res.status(200).json({ success: true, data: watercan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createWatercan, getAllWatercan };