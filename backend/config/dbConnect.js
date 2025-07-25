const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/paperpilot";
  try {
    await mongoose.connect(mongoUri);
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed, continuing without DB:", error.message);
  }
};

module.exports = dbConnect;