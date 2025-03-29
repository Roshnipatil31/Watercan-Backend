const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    user_id: { 
      type: String, 
      unique: true, 
      default: uuidv4 },

    email: {
      type: String,
      // required: [true, "Email is required"],
      // unique: true,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    phoneNumber: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);


