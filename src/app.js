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

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
