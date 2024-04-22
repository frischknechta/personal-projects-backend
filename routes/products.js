const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const ProductSchema = require("../schemas/Products");
const connEshop = require("../index");
const convertToBase64 = require("../utils/convertToBase64");
const isAuthenticated = require("../utils/isAuthenticated");

const Product = connEshop.model("Product", ProductSchema);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
router.post(
  "/product/create",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { name, description, price, quantity } = req.body;
      const product = await Product.find({ name: name });

      if (!product.length) {
        const newProduct = new Product({
          name: name,
          description: description,
          price: price,
          quantity: quantity,
        });

        if (req.files !== null) {
          const picturesToUpload = req.files.pictures;

          if (Array.isArray(picturesToUpload) === false) {
            console.log("1 image");
            const result = await cloudinary.uploader.upload(
              convertToBase64(picturesToUpload),
              { folder: `eShop/${newProduct._id}` }
            );
            newProduct.pictures.push(result);
          } else {
            console.log("Plusieurs images");

            const arrayOfPromises = picturesToUpload.map((picture) => {
              return cloudinary.uploader.upload(convertToBase64(picture), {
                folder: `eShop/${newProduct._id}`,
              });
            });

            const result = await Promise.all(arrayOfPromises);
            newProduct.pictures = result;
          }
        }

        await newProduct.save();

        res.status(201).json({
          message: `Your product ${name} has been added successfully!`,
        });
      } else {
        throw { message: "This product already exists!", status: 409 };
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// READ

// ALL PRODUCTS
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ONE PRODUCT BY ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.patch("/product/update", isAuthenticated, async (req, res) => {
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

      if (req.body.quantity && req.body.quantity >= 0) {
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

// DELETE
router.delete("/product/delete/:id", isAuthenticated, async (req, res) => {
  try {
    if (!req.params.id) {
      throw { message: "ID is missing", status: 400 };
    } else {
      await Product.findByIdAndDelete(req.params.id);

      res.json({ message: "Product has been deleted." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
