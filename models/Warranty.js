const mongoose = require("mongoose");

const Warranty = mongoose.model("Warranty", {
  reference: { type: String, minlength: 10, maxlength: 14 },
  serialNumber: { type: Number, min: 10000, max: 999999 },
  dateOfSale: Date,
  vendor: String,
});

module.exports = Warranty;
