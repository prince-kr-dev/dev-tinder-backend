const express = require("express");
const {connectDB} = require("./config/database");
const app = express();
const { User } = require("./models/user")

app.post("/signup", async (req, res) => {
  try {
    const userObj = {
      firstName: "John",
      lastName: "Kates",
      email: "kates.john@gmail.com",
      password: "kates@#123",
    };

    const user = new User(userObj);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(400).send("Failed to save user");
  }
});


connectDB()
  .then(() => {
    console.log("Databse connected successfully");
    app.listen(3000, () => {
      console.log("Serverver is successfully listening port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
