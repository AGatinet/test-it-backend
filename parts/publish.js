const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");
const User = require("../models/User");
const uploadPictures = require("./uploadPictures");
const NodeGeocoder = require("node-geocoder");

const options = {
	provider: "here",
	// Optional depending on the providers
	appId: "5lViz4C4oM4YMEFJEs9y",
	appCode: "0wWiJ2AlwArbGEvlKiuDGw",
	httpAdapter: "https", // Default
	// apiKey: "", // for Mapquest, OpenCage, Google Premier
	formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Importation de Cloudinary
const cloudinary = require("cloudinary");
// Configuration de Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const { Expo } = require("expo-server-sdk");
const expo = new Expo();

app.post("/publish", uploadPictures, function(req, res) {
	// NOTIFICATION LISTE D'ENVOIE
	const notificationTokens = [];
	if (req.body.genderTarget) {
		User.find({
			$or: [{ "account.sex": req.body.genderTarget }, { "account.sex": "" }]
		}).exec(function(err, result) {
			const today = new Date();
			for (i = 0; i < result.length; i++) {
				const birthDate = new Date(result[i].account.birthDate);
				const age = today.getFullYear() - birthDate.getFullYear();
				// console.log(age);
				// console.log("agemin", req.body.ageMin);
				// console.log("agemax", req.body.ageMax);
				if (age >= req.body.ageMin || age <= req.body.ageMax) {
					notificationTokens.push(result[i].tokenNotifications);
					// console.log(result.tokenNotifications);
				}
			}
			// console.log("notiftokens", notificationTokens);
		});
	}

	const geocoding = new Promise((resolve, reject) => {
		// Using callback
		geocoder.geocode(
			req.body.streetNumber +
				" " +
				req.body.streetName +
				" " +
				req.body.city +
				" " +
				req.body.country,
			// {
			// 	streetNumber: req.body.streetNumber,
			// 	streetName: req.body.streetName,
			// 	city: req.body.city
			// 	country: req.body.country,
			// 	zipcode: req.body.zipcode
			// },
			function(err, res) {
				/* adress.push(res[0]);
			console.log(adress); */
				if (!err) {
					console.log(res[0]);
					resolve(res[0]);
				} else {
					reject(err);
				}
			}
		);
	});

	// geocoding.then(address => console.log(address));

	geocoding
		.then(address => {
			const newOffer = new Offer({
				offerName: req.body.offerName,
				// creationDate: req.body.creationDate,
				deadlineInscription: req.body.deadlineInscription,
				deadlineTest: req.body.deadlineTest,
				duration: req.body.duration,
				picture: req.body.picture,
				adress: address,
				description: req.body.description,
				wantedProfiles: req.body.wantedProfiles,
				conditions: req.body.conditions,
				availabilities: req.body.availabilities,
				price: req.body.price,
				typeOffer: req.body.typeOffer,
				ageMin: req.body.ageMin,
				ageMax: req.body.ageMax,
				company: req.body.company,
				genderTarget: req.body.genderTarget
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
			// NOTIFICATION MESSAGES
			// Create the messages that you want to send to clents
			let messages = [];
			for (let pushToken of notificationTokens) {
				// Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
				// console.log("pushToken : ", pushToken);
				// Check that all your push tokens appear to be valid Expo push tokens
				if (!Expo.isExpoPushToken(pushToken)) {
					console.error(
						`Push token ${pushToken} is not a valid Expo push token`
					);
					continue;
				}

				// Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
				messages.push({
					to: pushToken,
					sound: "default",
					title: "Nouveau test",
					body:
						"Une nouvelle offre de test vous correspond, cliquez ici pour la voir !"
					// data: { withSome: "data" }
				});
			}
			let chunks = expo.chunkPushNotifications(messages);
			let tickets = [];
			(async () => {
				// Send the chunks to the Expo push notification service. There are
				// different strategies you could use. A simple one is to send one chunk at a
				// time, which nicely spreads the load out over time:
				for (let chunk of chunks) {
					try {
						let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
						console.log(ticketChunk);
						tickets.push(...ticketChunk);
						// NOTE: If a ticket contains an error code in ticket.details.error, you
						// must handle it appropriately. The error codes are listed in the Expo
						// documentation:
						// https://docs.expo.io/versions/latest/guides/push-notifications#response-format
					} catch (error) {
						console.error(error);
					}
				}
			})();
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = app;
