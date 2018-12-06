const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/home", function(req, res) {
  Offer.find({
    // $or: [{ mandatorySex: req.query.sexe }, { mandatorySex: "Both" }],
    // ageMax: { $gt: req.query.age },
    // ageMin: { $lt: req.query.age }
  }).exec(function(err, result) {
    res.json(result);
  });
});
module.exports = app;
