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
	})
		.populate("company")
		.exec(function(err, result) {
			res.json(result);
		});
});

app.get("/home/with-count", function(req, res) {
	const filter = {};
	if (
		(req.query.priceMin !== undefined && req.query.priceMin !== "") ||
		(req.query.priceMax !== undefined && req.query.priceMax !== "")
	) {
		filter.price = {};
		if (req.query.priceMin) {
			filter.price["$gte"] = req.query.priceMin;
		}

		if (req.query.priceMax) {
			filter.price["$lte"] = req.query.priceMax;
		}
	}

	if (req.query.title) {
		filter.title = {
			$regex: req.query.title,
			$options: "i"
		};
	}

	Offer.count(filter, (err, count) => {
		const query = Offer.find(filter).populate({
			path: "creator",
			select: "account"
		});

		if (req.query.skip !== undefined) {
			query.skip(parseInt(req.query.skip));
		}
		if (req.query.limit !== undefined) {
			query.limit(parseInt(req.query.limit));
		} else {
			// valeur par défaut de la limite
			query.limit(100);
		}

		switch (req.query.sort) {
			case "price-desc":
				query.sort({ price: -1 });
				break;
			case "price-asc":
				query.sort({ price: 1 });
				break;
			case "date-desc":
				query.sort({ created: -1 });
				break;
			case "date-asc":
				query.sort({ created: 1 });
				break;
			default:
		}

		query.exec((err, offers) => {
			res.json({ count, offers });
		});
	});
});

module.exports = app;
