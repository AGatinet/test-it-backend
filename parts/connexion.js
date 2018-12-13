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
var mailgun = require("mailgun-js");
var api_key = "e244c98d83e57f19966f674cbe22d46d-b3780ee5-34be795f";
var DOMAIN = "sandbox0480596c95704886bafdbd7099cafcf8.mailgun.org";
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: DOMAIN });

app.post("/log_in/forgot_password", function(req, res) {
  //Générer nouveau mot de passe

  //Chercher utilisateur dans la base de donnée.
  // - une fois que c'est bon, modifier le hash et le salt.
  // - enregistrer le user modifié dans la base de donnée.
  //    -une fois que c'est bon, envoyer email à l'utilisateur avec son mot de passe.
  const password = uid2(16);
  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  console.log("req.body.email ", req.body.email);
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    console.log("salut sofiane", err, user);
    if (!user) return res.status(400).json({ error: "L'email n'existe pas!" });
    if (user) {
      console.log("user", user);

      user.hash = hash;
      user.salt = salt;
      console.log("user.salt", user.salt);
      console.log("user.hash", user.hash);
      user.save(function(err, userSaved) {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.status(200).json({ message: "email envoyé" });
          console.log("usersaved.email", userSaved.email);
          var data = {
            from: "Excited User <me@samples.mailgun.org>",
            to: userSaved.email, // email de l'utilisateur normalement
            subject: "Test it",
            text: `Cher utilisateur, je vous redonne vos identifiants de connexion.\n
            Email: ${userSaved.email} \n
            Nouveau mot de passe: ${password} \n
            A bientôt ${userSaved.account.firstName}. \n\n
            L'équipe de Test it.`
          };

          mailgun.messages().send(data, function(error, body) {
            console.log(body);
          });
        }
      });
    }
  });
});

app.post("/sign_up", function(req, res) {
  const password = req.body.password;
  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  if (validator.isEmail(req.body.email) === false) {
    return res.status(400).json({ message: "Invalid email" });
  }
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (user) {
      res.status(400).json("err");
    } else {
      const newUser = new User({
        email: req.body.email,
        token: uid2(16),
        salt: salt,
        hash: hash
      }); // newUser est une instance du model User

      newUser.save(function(err, userSaved) {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.json({
            _id: userSaved._id,
            token: userSaved.token,
            email: userSaved.email,
            account: userSaved.account
          });
        }
      });
    }
  });
});

app.post("/log_in", function(req, res, next) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (err) return next(err.message);
    if (user) {
      console.log(user);
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        console.log("popo");
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

app.post("/facebook/log_in", function(req, res) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    console.log(user);
    if (user) {
      console.log("my best user", user);
      return res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    } else {
      console.log("my best body", req.body);
      const newUser = new User({
        email: req.body.email,
        token: uid2(16),
        account: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          photo: req.body.photo,
          sex: req.body.sex === "male" ? "homme" : "femme",
          birthDate: req.body.birthDate
        }
      }); // newUser est une instance du model User

      newUser.save(function(err, userSaved) {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.json({
            _id: userSaved._id,
            token: userSaved.token,
            email: userSaved.email,
            firstName: userSaved.account.firstName,
            lastName: userSaved.account.lastName,
            photo: userSaved.account.photo,
            account: userSaved.account,
            sex: userSaved.account.sex,
            birthDate: userSaved.account.birthDate
          });
        }
      });
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
      user.account.birthDate = req.body.birthDate || user.account.birthDate;
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
          console.log(user);
          res.status(200).json(user);
        }
      });
    }
  });
});

app.post("/freeemail", function(req, res) {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.json({ message: "Email déjà utilisé" });
    } else {
      return res.json({ hasCheckedEmail: true });
    }
  });
});

module.exports = app;
