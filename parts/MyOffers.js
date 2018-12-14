/* ROUTES PAGE MES OFFRES */

// Déclarer les dépendances
const express = require("express");
const app = express();
const Offer = require("../models/Offer");
const User = require("../models/User");

// Offres en favoris avec populate  ==========================================
app.get("/favorites/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate({
      path: "account.userOffers.favorites",
      populate: { path: "company" }
    })
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.favorites);
    });
});

// Vérifier les favoris  ======================================================
app.get("/checkfavorites/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("company")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.favorites);
    });
});

// Vérifier l'historique  =====================================================
app.get("/checkhistory/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate("company")
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.history);
    });
});

// Offres en attente de validation   ==========================================
app.get("/pendingValidation/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate({
      path: "account.userOffers.pendingValidation",
      populate: { path: "company" }
    })
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.pendingValidation);
    });
});

// Offres à venir   ===========================================================
app.get("/pending/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate({
      path: "account.userOffers.pending",
      populate: { path: "company" }
    })
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.pending);
    });
});

// Historique   ===============================================================
app.get("/history/:id", function(req, res, next) {
  User.findById(req.params.id)
    .populate({
      path: "account.userOffers.history",
      populate: { path: "company" }
    })
    .exec(function(err, Offers) {
      if (err) return handleError(err);
      res.json(Offers.account.userOffers.history);
    });
});

// Exporter le module
module.exports = app;
