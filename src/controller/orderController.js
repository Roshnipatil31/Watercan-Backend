const order = require("../model/orderModel");

const createOrder = async (req, res) => {
    try{
        const {user_id, watercan_id, totalAmount, orderStatus} = req.body;

        if(!user_id || !watercan_id || !totalAmount || !orderStatus){
            return res.status(400).json({ message: "All fields are required" });
        }

        const order = new order({ user_id, watercan_id, totalAmount, orderStatus });

        await order.save();

        res.status(201).json({ message: "Order created successfully", data: order });

    }catch(error){
        res.status(500).json({ message: "Error creating order", error: error.message });
    }

    };

const getAllOrder = async (req, res) => {
    try {
        const order = await order.find();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false, message: "Order not found"
            });
        }
        res.status(200).json({
            success: true, message: "Order found", data:
                order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding order",
            error: error.message,
        });
    }
}

const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await order.findByIdAndUpdate(id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false, message: "Order not found"
            });
        }
        res.status(200).json({
            success: true, message: "Order updated", data:
                order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order",
            error: error.message,
        });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({
                success: false, message: "Order not found"
            });
        }
        res.status(200).json({
            success: true, message: "Order deleted", data:
                order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting order",
            error: error.message,
        });
    }
}

module.exports = { createOrder, getAllOrder, getOrderById, updateOrder, deleteOrder };