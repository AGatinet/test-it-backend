const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/home", function(req, res) {
	Offer.find({
		$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "both" }],
		ageMax: { $gte: req.query.age },
		ageMin: { $lte: req.query.age }
	}).exec(function(err, result) {
		res.json(result);
	});
});
module.exports = app;
