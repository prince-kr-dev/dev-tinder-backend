const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address " + value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a strong password "+ value);
      }
    }
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value){
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    }
  },
  photoURL:{
    type: String,
    default:"https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  about:{
    type: String,
    default: "This is the default about of the user",
  },
  skills:{
    type: [String],
  }
},
{
  timestamps: true
}
);

userSchema.methods.getJWT = async function (){ //this keyword not work with arrow function ()=>{}

  const user = this;

  const token = await jwt.sign({_id: user.id}, "DEVTinder$79", {expiresIn: "1d"});

  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = { User };