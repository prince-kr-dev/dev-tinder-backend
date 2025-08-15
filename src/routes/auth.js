const express = require("express");
const authRouter = express.Router();
const {User} = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { validateSignupData } = require("../utils/validation");

//signup api for signing the user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the data
    validateSignupData(req);
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const checkEmail=await User.findOne({ email });
    console.log(checkEmail)
    if(checkEmail){
      throw new Error("Email Already Exist")
    }


    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({email});
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ user });
    } else {
      throw new Error("Invalid Vredentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("User Logged out successfully");
});

module.exports = authRouter;