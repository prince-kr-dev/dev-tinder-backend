const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json()); //middelware that convert json to js object

app.post("/signup", async (req, res) => {
  try {
    const { password,firstName, lastName, email } = req.body;


    //validation of data
    validateSignupData(req.body);

    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const userObj = req.body;
    console.log(userObj);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(400).send("ERROR : " + err.message);
  }
});

//GET user by email
app.get("/user", async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await User.find({ email: emailId });
    if (user.length == 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//GET all data
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//DELETE user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATE = [
      "firstName",
      "photoURL",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATE.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (Array.isArray(data.skills) && data.skills.length > 20) {
      throw new Error("Skills can't be more than 20");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true, //this run validator function when data updated
    });
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
