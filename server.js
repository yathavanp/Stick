//Initializing Server
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const passportLocalMongoose = require("passport-local-mongoose");
const connectDB = require("./db");

const app = express();
app.use(express.json());

//Initializing Passport & Express Session
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Initialize MonogDB
connectDB();

const userRouter = require("./routes/users");
app.use("/users", userRouter);

//Initialize Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server running on Port:" + PORT);
});

//Serving React
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
