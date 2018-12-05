// var Member = require('../models/Member.js')

const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
var validator = require("validator");
var User = require("../models/User");

app.post("/sign_up", function(req, res) {
  if (validator.isEmail(req.body.email) === false) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const password = req.body.password;
  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);

  const newUser = new User({
    email: req.body.email,
    token: uid2(16),
    salt: salt,
    hash: hash
  });

  newUser.save(function(err, userSaved) {
    if (err) {
      res.status(400).json("err: err.message");
    } else {
      res.json({
        _id: userSaved._id,
        token: userSaved.token,
        email: userSaved.email,
        account: userSaved.account
      });
    }
  });
});

app.post("/log_in", function(req, res, next) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (err) return next(err.message);
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return next("User not found");
    }
  });
});

app.post("/user/update", function(req, res) {
  console.log("req.body", req.body);

  User.findById(req.body._id).exec((err, user) => {
    if (err || !user) {
      // erreur ou user not found
      res.status(400).json({ message: "An error occurred" });
    } else {
      user.account.age = req.body.age || user.account.age;
      user.account.sex = req.body.sex || user.account.sex;
      user.account.firstName = req.body.firstName || user.account.firstName;
      user.account.lastName = req.body.lastName || user.account.lastName;
      user.account.adress = req.body.adress || user.account.adress;
      user.account.phone = req.body.phone || user.account.phone;
      user.account.bankAmount = req.body.bankAmount || user.account.bankAmount;
      user.account.description =
        req.body.description || user.account.description;
      user.account.bankAccount =
        req.body.bankAccount || user.account.bankAccount;
      user.account.photo = req.body.photo || user.account.photo;
      user.account.criterias = req.body.criterias || user.account.criterias;
      user.account.userOffers = req.body.userOffers || user.account.userOffers;

      user.save(err => {
        if (err) {
          res.status(400).json({ message: "An error occurred" });
        } else {
          res.status(200).json(user);
        }
      });
    }
  });
});

module.exports = app;

// User.findByIdAndUpdate(
//   { _id: req.body._id },
//   {
//     $set: {
//       account: {
//         age: req.body.age,
//         sex: req.body.sex,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName
//       }
//     }
//   },
//   { new: true },
//   function(err, user) {
//     if (err) {
//       res.json({ error: err.message });
//     } else {
//       console.log(user);
//       if (user === null) {
//         res.status(400).json("user not found");
//       } else {
//         res.status(200).json(user);
//       }
//       // ES6
//     }
//   }
// );
