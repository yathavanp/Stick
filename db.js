require("dotenv").config();
const mongoose = require("mongoose");

// Initialize Mongo Atlas Connection
const db = process.env.DB_NAME;

const connectDB = async () => {
  try {
    mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (err) {
    console.err(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
