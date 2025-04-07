const express = require('express');
const router = express.Router();
const vendorapplication = require('../controller/vendorapplicationController');

router.post('/createVendorApplication', vendorapplication.createApplication);
router.get("/getVendorApplication/:id", vendorapplication.getApllicationById);
router.get("/getAllApplications", vendorapplication.getAllApplication);
router.delete("/deleteVendorApplication/:id", vendorapplication.deleteApplication);
router.put("/approveVendorApplication/:application_id", vendorapplication.approveApplication);
router.put("/rejectVendorApplication/:id", vendorapplication.rejectApplication);
router.post("/api/pincode", vendorapplication.pincodeDetails);
router.get("/getApplicationByUserId/:userId", vendorapplication.getApplicationByUserId);

module.exports = router;