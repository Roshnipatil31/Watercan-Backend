const mongoose = require("mongoose");

const watercanSchema = new mongoose.Schema({
    variety: {
        type: String,
    }
})

module.exports = mongoose.model("Watercan", watercanSchema);