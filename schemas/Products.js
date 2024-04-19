const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  pictures: Array,
});

module.exports = ProductSchema;
