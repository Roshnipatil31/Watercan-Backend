const mongoose = require("mongoose");

const vendorapplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
    address:{
        type: String,
        required: [true, "Address is required"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    area: {
        type: String,
        required: [true, "Area is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },

    latitude: {
        type: Number,
    },

    longitude: {
        type: Number,
    },
   
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      delivery_start_time: {
        type: Date,
      },
      delivery_end_time: {
        type: Date,
      },
    
    
      deliverable_water_cans: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Watercan",
        }
      ],

      proof_image: {
        type: String,
        required: [true, "Proof image is required"],
      },
  
    createdAt: {
        type: Date,
        default: Date.now,
      },
    
});
    
module.exports = mongoose.model("Vendorapplication", vendorapplicationSchema);
