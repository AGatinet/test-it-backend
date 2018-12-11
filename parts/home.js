const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/home", function(req, res) {
	Offer.find({
		$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
		ageMax: { $gte: req.query.age },
		ageMin: { $lte: req.query.age }
	})
		.populate("company")
		.exec(function(err, result) {
			res.json(result);
		});
});

app.get("/home/with-count", function(req, res) {
	let filter = {};
	if (!req.query.title) {
		filter = {
			$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
			ageMax: { $gte: req.query.age },
			ageMin: { $lte: req.query.age }
		};
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
	} else {
		filter = {
			// $and: [
			// 	{
			$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
			// },
			// {
			// $or: [
			// 	{
			// 		offerName: {
			// 			$regex: req.query.title,
			// 			$options: "i"
			// 		}
			// 	}
			// {
			// 	company: {
			// 		companyAccount: {
			// 			companyName: {
			// 				$regex: req.query.title,
			// 				$options: "i"
			// 			}
			// 		}
			// 	}
			// }
			// ]
			// 	}
			// ],

			ageMax: { $gte: req.query.age },
			ageMin: { $lte: req.query.age }
		};
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
	}
	// if (req.query.title) {
	// 	// title = [];
	// 	// title.offerName = {
	// 	// 	$regex: req.query.title,
	// 	// 	$options: "i"
	// 	// };
	// 	// title.companyName = {
	// 	// 	$regex: req.query.title,
	// 	// 	$options: "i"
	// 	// };
	// 	(filter["$and"] = {
	// 		$or: [
	// 			{
	// 				offerName: {
	// 					$regex: req.query.title,
	// 					$options: "i"
	// 				}
	// 			},
	// 			{
	// 				companyName: {
	// 					$regex: req.query.title,
	// 					$options: "i"
	// 				}
	// 			}
	// 		]
	// 	}),
	// 		{ $or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }] };
	// 	// console.log(filter.title);
	// }

	Offer.count(filter, (err, count) => {
		// const query = Offer.find(filter).populate({
		// 	path: "creator",
		// 	select: "account"
		// });
		// console.log(filter);
		const query = Offer.find(filter).populate("company");

		// if (req.query.skip !== undefined) {
		// 	query.skip(parseInt(req.query.skip));
		// }
		// if (req.query.limit !== undefined) {
		// 	query.limit(parseInt(req.query.limit));
		// } else {
		// 	// valeur par défaut de la limite
		// 	query.limit(100);
		// }

		switch (req.query.sort) {
			case "Prix décroissants":
				query.sort({ price: -1 });
				break;
			case "Prix croissants":
				query.sort({ price: 1 });
				break;
			case "Les plus récentes":
				query.sort({ creationDate: 1 });
				break;
			case "date-asc":
				query.sort({ creationDate: 1 });
				break;
			case "date-asc":
				query.sort({ created: 1 });
				break;
			case "date-asc":
				query.sort({ created: 1 });
				break;
			default:
				query.sort({ creationDate: 1 });
				break;
		}

		query.exec((err, offers) => {
			if (!req.query.title) {
				res.json({ count, offers });
			} else {
				const result = offers.filter(function(offer) {
					return (
						offer["offerName"] ==
						{
							$regex: req.query.title,
							$options: "i"
						}
						// ||
						// offer["company"]["companyAccount"]["companyName"] ==
						// 	{
						// 		$regex: req.query.title,
						// 		$options: "i"
						// 	}
					);
				});
				console.log(result);
				res.json({ result });
			}
		});
	});
});

module.exports = app;
