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

const getWatercanById = async (req, res) => {
    try {
        const id = req.params.id;
        const watercan = await Watercan.findById(id);
        if (!watercan) {
            return res.status(404).json({ success: false, message: "Watercan not found" });
        }
        res.status(200).json({ success: true, data: watercan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleetWatercanById = async (req, res) => {
    try {
        const id = req.params.id;
        const watercan = await Watercan.findByIdAndDelete(id);
        if (!watercan) {
            
            return res.status(404).json({ success: false, message: "Watercan not found" });
            }
            res.status(200).json({ success: true, message: "Watercan deleted successfully"
                });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

module.exports = { createWatercan,
     getAllWatercan,
     getWatercanById,
     deleetWatercanById
     };