// vendorController.js
const VendorApplication = require('../model/vendorapplicationModel'); // path to your vendor application model
const Vendor = require('../model/vendorModel'); // path to your vendor model


const getVendorById = async (req, res) => {
    try {
        const id = req.params.id;
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({
                success: false, message: "Vendor not found"
            });
        }
        res.status(200).json({
            success: true, message: "Vendor found", data:
                vendor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding vendor",
            error: error.message,
        });
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json({
            success: true,
            message: "Vendors found",
            data: vendors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding vendors",
            error: error.message,
        });
    }
}
const getVendorsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming userId is passed as a URL parameter
        const vendors = await Vendor.find({ user_id: userId });
        if (!vendors || vendors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vendors found for this user",
            });
        }
        res.status(200).json({
            success: true,
            message: "Vendors found",
            data: vendors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding vendors",
            error: error.message,
        });
    }
}

module.exports = {
    getVendorById,
    getAllVendors,
    getVendorsByUserId
};
