const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
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

const User = mongoose.model("User", userSchema);

module.exports = { User };