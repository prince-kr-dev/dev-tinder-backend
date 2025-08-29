const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
};

module.exports = { connectDB };
