const mongoose = require("mongoose");
const { watch } = require("./vendorapplicationModel");

const orderSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    watercan_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Watercan"
    },
   
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
    },
   
    orderStatus: {
        type: String,
        enum: ["Order placed", "Shipped", "Delivered"],
        default: "Order placed",
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