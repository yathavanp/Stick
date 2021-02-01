const router = require("express").Router();
const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const passport = require("passport");

//Initialize Routes GET and POSTS Methods
router
  .route("/register")
  .get((req, res) => {
    res.send("REGISTER PAGE");
  })
  //Verify Password Requirements
  .post(
    [
      check("email", "Email is required").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
    async (req, res) => {
      //Validate Password
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      try {
        //Checking if User already Exist
        User.findOne({ email }, function (err, user) {
          if (user) {
            res.status(400).json({ errors: [{ msg: "User already exists" }] });
          }
        });
        //Register User
        User.register({ email: email }, password, (err, user) => {
          if (err) {
            console.log(err.message);
          } else {
            passport.authenticate("local")(req, res, function () {
              res.send(req.user);
            });
          }
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  );

router
  //Logging In User
  .route("/login")
  .post(async (req, res) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    try {
      req.logIn(user, (err) => {
        if (err) {
          console.log(err.message);
          res.status(400).json({ errors: [{ msg: "Bad Request" }] });
        } else {
          passport.authenticate("local")(req, res, function () {
            res.send(req.user);
          });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  })
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.send("LOGGED IN!");
    } else {
      res.send("Not Signed in");
    }
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

router
  //Adding Notes to Users Profile
  .route("/notes")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  })
  .post(async (req, res) => {
    try {
      User.findOneAndUpdate(
        { email: req.body.email },
        { secrets: req.body.arr },
        (err, doc) => {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
