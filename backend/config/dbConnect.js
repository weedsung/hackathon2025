const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
};

module.exports = dbConnect;