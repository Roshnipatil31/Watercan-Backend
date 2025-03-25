const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
router.post('/create', userController.createUSer);
router.post('/get-user', userController.getUserById);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOtp);


module.exports = router;
