const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const UserSchema = require("../schemas/User");
const connEshop = require("../index");

const User = connEshop.model("User", UserSchema);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// SIGN UP
router.post("/user/signup", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.username && req.body.email && req.body.password) {
      const { username, password, email } = req.body;

      const user = await User.findOne({ email: email });

      if (user) {
        throw { message: "This email already has an account", status: 409 };
      } else {
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(64);

        const newUser = new User({
          username: username,
          email: email,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();

        res.json({ message: `User ${username} has been created!` });
      }
    } else {
      throw { message: "Missing parameters", status: 400 };
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
