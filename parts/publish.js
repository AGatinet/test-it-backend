const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.post("/publish", function(req, res) {
	const newOffer = new Offer({
		offerName: req.body.offerName,
		creationDate: req.body.creationDate,
		deadlineInscription: req.body.deadlineInscription,
		dateFinalTest: req.body.dateFinalTest,
		duration: req.body.duration,
		picture: req.body.picture,
		adress: {
			country: req.body.country,
			city: req.body.city,
			street: req.body.street,
			number: req.body.number,
			postCode: req.body.postCode,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			latitudeDelta: req.body.latitudeDelta,
			longitudeDelta: req.body.longitudeDelta
		},
		description: req.body.description,
		wantedProfiles: req.body.wantedProfiles,
		conditions: req.body.conditions,
		availabilities: req.body.availabilities,
		price: req.body.price,
		typeOffer: req.body.typeOffer
	});

	// Sauvegarder l’offre
	newOffer.save(function(err, offerSaved) {
		if (err) {
			res.status(400).json(err.message);
		} else {
			res.json(
				"Nouvelle offre enregistrée avec succès ! Id de l’offre : " +
					offerSaved._id
			);
		}
	});
});
