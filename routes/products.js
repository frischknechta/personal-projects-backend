const express = require("express");
const router = express.Router();

const ProductSchema = require("../schemas/Products");
const connEshop = require("../index");

const Product = connEshop.model("Product", ProductSchema);

router.post("/addProduct", async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, price, quantity } = req.body;

    const newProduct = new Product({
      name: name,
      description: description,
      price: price,
      quantity: quantity,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: `Your product ${name} has been added successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
