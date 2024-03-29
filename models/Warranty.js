const mongoose = require("mongoose");

const Warranty = mongoose.model("Warranty", {
  reference: String,
  serialNumber: Number,
  dateOfSale: Date,
  vendor: String,
});

module.exports = Warranty;
