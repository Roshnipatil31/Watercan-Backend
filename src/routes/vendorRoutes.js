const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendorController");

router.get("/getVendorById/:id", vendorController.getVendorById);
router.get("/getAllVendors", vendorController.getAllVendors);
module.exports = router;