const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");

app.use(express.json()); //middelware that convert json to js object
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { password,firstName, lastName, email } = req.body;


    //validation of data
    validateSignupData(req.body);

    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    const userObj = req.body;
    // console.log(userObj);

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

app.post("/login", async (req,res)=>{
  try {
    const {email, password} = req.body;

    if(!validator.isEmail(email)){
      throw new Error("Enter valid email");
    }

    const user = await User.findOne({email : email});
    if(!user){
      throw new Error("Invalid Crendential");
    }

    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){

      const token = await user.getJWT();

      res.cookie("token",token);
      // console.log(token);
      

      res.send("Login Successfull");
    }
    else{
      throw new Error("Invalid Crendential");
    }


  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})


app.get("/profile", userAuth, async(req,res)=>{
  try{
    const user = req.user;

    console.log(`You are: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`);

    res.send(user);
  }catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

app.post("/sendConnectionRequest", userAuth, (req,res)=>{
  const user = req.user;
  console.log("Connection request sent");

  res.send(user.firstName + " "+ user.lastName +" sent connection request");
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
