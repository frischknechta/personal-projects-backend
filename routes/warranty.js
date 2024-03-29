const express = require("express");
const router = express.Router();

const Warranty = require("../models/Warranty");

// ROUTE CREATE

router.post("/register", async (req, res) => {
  try {
    const { ref, sn, date, vendor } = req.body;
    const dateOfSale = new Date(date);

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

module.exports = router;
