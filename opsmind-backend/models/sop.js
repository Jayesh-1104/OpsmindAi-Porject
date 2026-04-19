const mongoose = require("mongoose");

const sopSchema = new mongoose.Schema({
  title: String,
  filePath: String,
}, { timestamps: true });

module.exports = mongoose.model("SOP", sopSchema);