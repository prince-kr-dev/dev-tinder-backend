const validator = require("validator");

const validateSignupData = (req)=>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }
}

const validateEditFields = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "gender",
      "about",
      "photoURL",
      "skills",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
    return isEditAllowed;
  };
  module.exports = {
    validateSignupData,
    validateEditFields,
  };