const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");

app.use(express.json()); //middelware that convert json to js object

app.post("/signup", async (req, res) => {
  try {
    // const userObj = {
    //   firstName: "Nelson",
    //   lastName: "Mandela",
    //   email: "mandela.john@gmail.com",
    //   password: "nelson@#123",
    // };

    //dynamic data
    const userObj = req.body;
    console.log(userObj);

    const user = new User(userObj);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(400).send("Failed to save user");
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
app.get("/feed", async(req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//DELETE user
app.delete("/user", async(req,res)=>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update data
app.patch("/user", async(req, res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try{
    await User.findByIdAndUpdate({_id: userId}, data);
    res.send("User data updated successfully");
  }catch (err) {
    res.status(400).send("Something went wrong");
  }
})

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
