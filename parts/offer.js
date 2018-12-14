/* ROUTES PAGE DESCRIPTION DE L'OFFRE */

// Déclarer les dépendances
const express = require("express");
const app = express();
const Offer = require("../models/Offer");
const User = require("../models/User");

// 1ère route : charger une annonce   ==================================================
app.get("/offer/:id", function(req, res, next) {
	Offer.findById(req.params.id)
		.populate("company")
		.exec(function(err, Offers) {
			if (err) return handleError(err);
			res.json(Offers);
		});
});

// 2ème route : S'inscrire / Se désincrire  =========================================================
app.post("/addRemoveTester", function(req, res) {
	let Offer_id = req.body.Offer_id;
	let User_id = req.body.User_id;
	if (Offer_id === "" || User_id === "") {
		return res.json("Identifiant de l'offre ou de l'utilisateur absent !");
	}
	// Transfert/Supression de l'id de l'user dans l'offre
	Offer.findOne({ _id: Offer_id }).exec(function(err, OfferFound) {
		if (err) {
			res.json(err);
		} else {
			if (OfferFound.listTesters.indexOf(User_id) === -1) {
				// Inscrire l'utilisateur
				OfferFound.listTesters.push(User_id);
				OfferFound.save(function(err, OfferSaved) {});
			} else {
				// Désincrire l'utilisateur
				let i = OfferFound.listTesters.indexOf(User_id);
				OfferFound.listTesters.splice(i, 1);
				OfferFound.save(function(err, OfferSaved) {});
			}
		}
	});
	// Transfert/Supression de l'id de l'offre dans l'user
	User.findOne({ _id: User_id }).exec(function(err, UserFound) {
		if (err) {
			res.json(err);
		} else {
			if (
				UserFound.account.userOffers.pendingValidation.indexOf(Offer_id) === -1
			) {
				// Ajouter dans le tableau pendingValidation
				UserFound.account.userOffers.pendingValidation.push(Offer_id);
				// Retirer l'annonce des favoris
				let k = UserFound.account.userOffers.favorites.indexOf(Offer_id);
				UserFound.account.userOffers.favorites.splice(k, 1);
				UserFound.save(function(err, UserSaved) {
					res.json(
						"Inscription enregistrée avec succès ! \n Vous recevrez une confirmation de votre inscription par sms."
					);
				});
			} else {
				// Retirer l'id de l'offre dans favoris, pendingValidation et pending
				let i = UserFound.account.userOffers.pending.indexOf(Offer_id);
				let j = UserFound.account.userOffers.pendingValidation.indexOf(
					Offer_id
				);
				UserFound.account.userOffers.pending.splice(i, 1);
				UserFound.account.userOffers.pendingValidation.splice(j, 1);
				UserFound.save(function(err, UserSaved) {
					res.json(
						"Votre désinscription à été enregistrée. \n Au plaisir de vous revoir très prochainement sur Test-it !"
					);
				});
			}
		}
	});
});

// 3ème route : ajouter/retirer des favoris  ==================================================
app.post("/addToFavorite", function(req, res) {
	let Offer_id = req.body.Offer_id;
	let User_id = req.body.User_id;
	if (Offer_id === "" || User_id === "") {
		return res.json("Identifiant de l'offre ou de l'utilisateur absent !");
	}
	User.findOne({ _id: User_id }).exec(function(err, UserFound) {
		if (err) {
			res.json(err);
		} else {
			if (UserFound.account.userOffers.favorites.indexOf(Offer_id) === -1) {
				// Mettre en favoris
				UserFound.account.userOffers.favorites.push(Offer_id);
				UserFound.save(function(err, UserSaved) {
					res.json("Cette offre est sauvegardée dans l'univers Mes Offres.");
				});
			} else {
				// Retirer des favoris
				let i = UserFound.account.userOffers.favorites.indexOf(Offer_id);
				UserFound.account.userOffers.favorites.splice(i, 1);
				UserFound.save(function(err, UserSaved) {
					res.json("Cette offre à été retirée de l'univers Mes Offres.");
				});
			}
		}
	});
});

// 4ème route : Valider sa participation  ==================================================
app.post("/participation", function(req, res) {
  let Offer_id = req.body.Offer_id;
  let User_id = req.body.User_id;
  if (Offer_id === "" || User_id === "") {
    return res.json("Identifiant de l'offre ou de l'utilisateur absent !");
  }
  User.findOne({ _id: User_id }).exec(function(err, UserFound) {
    if (err) {
      res.json(err);
    } else {
      // Ajouter à l'historique
      if (UserFound.account.userOffers.history.indexOf(Offer_id) === -1) {
        UserFound.account.userOffers.history.push(Offer_id);
        UserFound.save(function(err, UserSaved) {});
        // Retirer des favoris
        let i = UserFound.account.userOffers.favorites.indexOf(Offer_id);
        UserFound.account.userOffers.favorites.splice(i, 1);
        UserFound.save(function(err, UserSaved) {
          res.json("Cette offre à été retirée de l'univers Mes Offres.");
        });
      }
    }
  });
});

// Exporter le module
module.exports = app;
