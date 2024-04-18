const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const connEshop = mongoose.createConnection(
  `${process.env.MONGODB_URI}/eshop-app`
);
module.exports = connEshop;

const app = express();
app.use(express.json());
app.use(cors());

const warrantyRoutes = require("./routes/warranty");
app.use(warrantyRoutes);

const productsRoutes = require("./routes/products");
app.use(productsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
