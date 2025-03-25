const mongoose = require("mongoose");
// const { watch } = require("./vendorapplicationModel");

const orderSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    watercan_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Watercan"
    },

    vendor_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendorapplication"
    },
   
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
    },
   
    orderStatus: {
        type: String,
        enum: ["Order placed", "Shipped", "Delivered", "Cancelled"],
        default: "Order placed",
    },

    timeSlot: {
        type: String,
        required: [true, "Time slot is required"],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    
});

module.exports = mongoose.model("Order", orderSchema);