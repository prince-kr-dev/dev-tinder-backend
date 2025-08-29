const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json()); //middelware that convert json to js object
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Databse connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is successfully listening on port ${process.env.PORT}...`);
    });    
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
