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

app.post("/api/sign_up", function(req, res) {
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

app.post("/api/log_in", function(req, res, next) {
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

module.exports = app;
