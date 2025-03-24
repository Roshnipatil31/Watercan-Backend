const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/createOrder", orderController.createOrder);
router.get("/getAllOrders", orderController.getAllOrder);
router.get("/getOrder/:id", orderController.getOrderById);
router.put("/updateOrder/:id", orderController.updateOrder);
router.delete("/deleteOrder/:id", orderController.deleteOrder);

module.exports = router;