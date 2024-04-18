const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
});

module.exports = ProductSchema;
