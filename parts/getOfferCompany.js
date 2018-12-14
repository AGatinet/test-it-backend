const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/get_offer_company", function(req, res) {
	Offer.find({
		company: req.body.id
	}).exec(function(result) {
		res.json(result);
	});
});

module.exports = app;
