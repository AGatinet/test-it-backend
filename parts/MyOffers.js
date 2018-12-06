/* ROUTES PAGE MES OFFRES */

// Déclarer les dépendances
const express = require("express");
const app = express();
const Offer = require("../models/Offer");
const User = require("../models/User");

// Offres en favoris   ========================================================
app.get("/favories/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("account.userOffers.favorites")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers);
    });
});

// Offres en attente de validation   ==========================================
app.get("/pendingValidation/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("account.userOffers.pendingValidation")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers);
    });
});

// Offres à venir   ===========================================================
app.get("/pending/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("account.userOffers.pending")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers);
    });
});

// Historique   ===============================================================
app.get("/history/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("account.userOffers.history")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers);
    });
});

// Exporter le module
module.exports = app;
