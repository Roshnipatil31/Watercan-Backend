const Watercan = require("../model/watercanModel");

const createWatercan = async (req, res) => {
    
    try {
        const {variety} = req.body;
        const watercan = await Watercan.create({variety});
        res.status(201).json(watercan);
        } catch (error) {
            res.status(500).json({ message: error.message });
            }
}

const getAllWatercan = async (req, res) => {
    
    try {
        const watercan = await Watercan.find();
        res.status(200).json(watercan);
        } catch (error) {
            res.status(500).json({ message: error.message });
            }

}
module.exports = { createWatercan, getAllWatercan };