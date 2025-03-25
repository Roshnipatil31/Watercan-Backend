const mongoose = require("mongoose");
const Order = require("../model/orderModel");
const Vendorapplication = require("../model/vendorapplicationModel");

const createOrder = async (req, res) => {
    try {
        const { user_id, watercan_id, vendor_id, totalAmount, orderStatus, timeSlot } = req.body;

        if (!user_id || !watercan_id || !vendor_id || !totalAmount || !timeSlot) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newOrder = new Order({ user_id, watercan_id, vendor_id, totalAmount, orderStatus, timeSlot });
        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", data: newOrder });

    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false, message: "Order not found"
            });
        }
        res.status(200).json({
            success: true, message: "Order found",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding order",
            error: error.message,
        });
    }
}

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrdersByVendor = async (req, res) => {
    try {
        const { vendor_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(vendor_id)) {
            return res.status(400).json({ success: false, message: "Invalid Vendor ID" });
        }

        // Fetch orders but exclude `vendor_id` from the response
        const orders = await Order.find({ vendor_id: vendor_id })
            .populate("user_id watercan_id")
            .select("-vendor_id");

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found for this vendor" });
        }

        res.status(200).json({ success: true, message: "Orders retrieved successfully", data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false, message: "Order not found"
            });
        }
        res.status(200).json({
            success: true, message: "Order updated",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order",
            error: error.message,
        });
    }
}


module.exports = { createOrder, getOrderById, getAllOrder, getOrdersByVendor, updateOrder };
