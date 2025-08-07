const mongoose = require("mongoose");

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
  },
  password: {
    type: String,
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
  },
  about:{
    type: String,
    default: "This is the default about of the user",
  },
  sills:{
    type: [String],
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };