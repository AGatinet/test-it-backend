// var Member = require('../models/Member.js')

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/api/home", function(req, res) {
	Offer.find({
		$or: [{ mandatorySex: req.query.sex }, { mandatorySex: "Both" }],
		ageMax: { $gt: req.query.age },
		ageMin: { $lt: req.query.age }
	}).exec(function(err, result) {
		res.json(result);
	});
});

module.exports = app;
