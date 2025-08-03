const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://princekumark2004:dMX1mrJ7ata9xmBo@cluster0.etgaj0w.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
};

module.exports = { connectDB };
