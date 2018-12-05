const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
var validator = require("validator");
var Company = require("../models/Company");

app.post("/sign_up_company", function(req, res) {
	if (validator.isEmail(req.body.email) === false) {
		return res.status(400).json({ message: "Invalid email" });
	}

	const password = req.body.password;
	const salt = uid2(16);
	const hash = SHA256(password + salt).toString(encBase64);

	const newCompany = new Company({
		email: req.body.email,
		token: uid2(16),
		salt: salt,
		hash: hash,
		companyAccount: {
			companyName: req.body.companyName
		}
	});

	newCompany.save(function(err, companySaved) {
		if (err) {
			res.status(400).json("err: err.message");
		} else {
			res.json({
				_id: companySaved._id,
				token: companySaved.token,
				email: companySaved.email,
				companyAccount: companySaved.companyAccount
			});
		}
	});
});

app.post("/log_in_company", function(req, res, next) {
	Company.findOne({ email: req.body.email }).exec(function(err, company) {
		if (err) return next(err.message);
		if (company) {
			if (
				SHA256(req.body.password + company.salt).toString(encBase64) ===
				company.hash
			) {
				return res.json({
					_id: company._id,
					token: company.token,
					companyAccount: company.companyAccount
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
