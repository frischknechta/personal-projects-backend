const express = require("express");
const router = express.Router();

const ProductSchema = require("../schemas/Products");
const connEshop = require("../index");

const Product = connEshop.model("Product", ProductSchema);

router.post("/add-product", async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    const product = await Product.find({ name: name });

    console.log(product);

    if (!product.length) {
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
    } else {
      throw { message: "This product already exists!", status: 409 };
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/update-product", async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.name) {
      const product = await Product.findOne({ name: req.body.name });
      if (req.body.description) {
        product.description = req.body.description;
      }

      if (req.body.price) {
        product.price = req.body.price;
      }

      if (req.body.quantity) {
        product.quantity = req.body.quantity;
      }

      await product.save();

      res.json(product);
    } else {
      throw { message: "Missing parameter", status: 400 };
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-product", async (req, res) => {
  try {
    if (!req.body.id) {
      throw { message: "ID is missing", status: 400 };
    } else {
      await Product.findByIdAndDelete(req.body.id);

      res.json({ message: "Product has been deleted." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
