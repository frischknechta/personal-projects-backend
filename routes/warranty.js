const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const WarrantySchema = require("../schemas/Warranty");

const connWarranty = mongoose.createConnection(
  `${process.env.MONGODB_URI}/warranty-app`
);

const Warranty = connWarranty.model("Warranty", WarrantySchema);

// ROUTE CREATE

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { ref, sn, date, vendor } = req.body;
    const dateOfSale = new Date(date);
    const dateOfWarranty = new Date(dateOfSale);
    dateOfWarranty.setFullYear(dateOfWarranty.getFullYear() + 2);

    const warranty = await Warranty.findOne({
      reference: ref,
      serialNumber: sn,
    });
    if (warranty) {
      res.status(409).json({
        message: "The warranty for this product has already been registered !",
      });
    } else {
      const newWarranty = new Warranty({
        reference: ref,
        serialNumber: sn,
        dateOfSale: dateOfSale,
        dateOfWarranty: dateOfWarranty,
        vendor: vendor,
      });

      await newWarranty.save();

      res.status(201).json({ message: "Warranty has been registered." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE READ

router.get("/warranty-check", async (req, res) => {
  try {
    console.log(req.query);
    const { ref, sn } = req.query;

    const warranty = await Warranty.findOne({
      reference: ref,
      serialNumber: sn,
    });
    if (warranty) {
      res.json(warranty);
    } else {
      res.status(404).json({
        message:
          "This product has not been found. The reference and/or serial number might be incorrect or warranty has not been registered for this product. If you think this is an error, please contact us.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
