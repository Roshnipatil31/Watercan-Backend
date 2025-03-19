const vendorApplication = require("../model/vendorapplicationModel");

const createApplication = async (req, res) => {
  try {
    const { name, email, state, address, phoneNumber, pincode, city ,delivery_start_time,delivery_end_time,deliverable_water_cans} = req.body;

    if (
      !name ||
      !email ||
      !state ||
      !address ||
      !phoneNumber ||
      !pincode ||
      !city||
      !delivery_start_time||
      !delivery_end_time||
      !deliverable_water_cans
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    const vendorapplication = await vendorApplication.create({
      name,
      email,
      state,
      address,
      phoneNumber,
      pincode,
      city,
      delivery_start_time,
      delivery_end_time,
      deliverable_water_cans,
      status: "pending",
    });
    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: vendorapplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting application",
      error: error.message,
    });
  }
};

const getApllicationById = async (req, res) => {
    
    try {
        const id = req.params.id;
        const vendorapplication = await vendorApplication.findById(id);
        if (!vendorapplication) {
            return res.status(404).json({ success: false, message: "Application not found"
                });
                }
                res.status(200).json({ success: true, message: "Application found", data:
                    vendorapplication });
                    } catch (error) {
                        res.status(500).json({
                            success: false,
                            message: "Error finding application",
                            error: error.message,
                            });
                            }
}

const getAllApplication = async (req, res) => {
    try {
        const vendorapplication = await vendorApplication.find();
        res.status(200).json(vendorapplication);
        } catch (error) {
            res.status(500).json({ message: error.message });
            }
            
}

const deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const vendorapplication = await vendorApplication.findByIdAndDelete(id);
        if (!vendorapplication) {
            return res.status(404).json({ success: false, message: "Application not found"
                });
                }
                res.status(200).json({ success: true, message: "Application deleted", data:
                    vendorapplication });
                    } catch (error) {
                        res.status(500).json({
                            success: false,
                            message: "Error deleting application",
                            error: error.message,
                            });
                            }
}
module.exports = { createApplication, getApllicationById, getAllApplication, deleteApplication };
