const vendorApplication = require("../model/vendorapplicationModel");
const nodemailer = require("nodemailer");


const createApplication = async (req, res) => {
  try {
    const {user_id, proof_image,name, email, state, address, phoneNumber, pincode, city, delivery_start_time, delivery_end_time,deliverable_water_cans} = req.body;
console.log(req.body);
    if (
      !user_id ||
      !name ||
      !email ||
      !state ||
      !address ||
      !phoneNumber ||
      !pincode ||
      !city ||
      !delivery_start_time ||
      !delivery_end_time  ||
      !deliverable_water_cans ||
      !proof_image
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
      user_id,
      state,
      address,
      phoneNumber,
      pincode,
      city,
      delivery_start_time,
      delivery_end_time,
      deliverable_water_cans,
      proof_image,
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
      return res.status(404).json({
        success: false, message: "Application not found"
      });
    }
    res.status(200).json({
      success: true, message: "Application found", data:
        vendorapplication
    });
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
      return res.status(404).json({
        success: false, message: "Application not found"
      });
    }
    res.status(200).json({
      success: true, message: "Application deleted", data:
        vendorapplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting application",
      error: error.message,
    });
  }
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send an approval email
const sendApprovedEmail = async (email) => {
  try {
    let info = await transporter.sendMail({
      from: `"Company Name" <${process.env.EMAIL_USER}>`, 
      to: email, // Recipient email
      subject: "Application Approved",
      text: "Congratulations! Your application has been approved.",
      html: "<b>Congratulations!</b> <p>Your application has been approved.</p>",
    });

    console.log(`Approved Email sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const Vendor = require("../model/vendorModel"); // Import the vendor model

const approveApplication = async (req, res) => {
  try {
    const { application_id } = req.params;

    if (!application_id) {
      return res
        .status(400)
        .json({ success: false, message: "Application ID is required." });
    }

    const application = await vendorApplication.findById(application_id);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found." });
    }

    // Check if the application is already approved
    if (application.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Application is already approved.",
      });
    }

    // Create a new vendor record in the vendor collection
    const newVendor = await Vendor.create({
      name: application.name,
      email: application.email,
      user_id: application.user_id,
      state: application.state,
      address: application.address,
      phoneNumber: application.phoneNumber,
      pincode: application.pincode,
      city: application.city,
      delivery_start_time: application.delivery_start_time,
      delivery_end_time: application.delivery_end_time,
      deliverable_water_cans: application.deliverable_water_cans,
    });

    // Update the application status to 'approved'
    application.status = "approved";
    await application.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Application approved and vendor created successfully!",
      data: newVendor,
    });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({
      success: false,
      message: "Error approving application",
      error: error.message,
    });
  }
};

module.exports = { approveApplication };


const sendRejectedEmail = async (email) => {
  try {
    let info = await transporter.sendMail({
      from: `"Company Name" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Application Rejected",
      text: "Your application has been rejected.",
      html: "<b>Sorry!</b> <p>Your application has been rejected.</p>",
    });

    console.log(`Rejected Email sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const rejectApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const vendorapplication = await vendorApplication.findByIdAndUpdate(id,
      { status: "rejected" },
      { new: true }
    );
    if (!vendorapplication) {
      return res.status(404).json({
        success: false, message: "Application not found"
      });
    }

    sendRejectedEmail(vendorapplication.email);

    res.status(200).json({
      success: true, message: "Application rejected", data:
        vendorapplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting application",
      error: error.message,
    });
  }
}
module.exports = { createApplication, 
  getApllicationById, 
  getAllApplication,
   deleteApplication,
   approveApplication,
    sendApprovedEmail,
    sendRejectedEmail,
    rejectApplication,
  };

