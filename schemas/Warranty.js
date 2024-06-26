const mongoose = require("mongoose");

const WarrantySchema = mongoose.Schema({
  reference: { type: String, minlength: 10, maxlength: 14 },
  serialNumber: { type: Number, min: 10000, max: 999999 },
  dateOfSale: Date,
  dateOfWarranty: Date,
  vendor: String,
});

module.exports = WarrantySchema;
