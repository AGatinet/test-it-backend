//Importer les dépendances
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const mongoose = require("mongoose");
//Connecter la base de données
mongoose.connect(
  "mongodb://heroku_fvvkbxfv:m7gb3ikcpt60e1v2shofr8gkb3@ds125680.mlab.com:25680/heroku_fvvkbxfv",
  { useNewUrlParser: true, useCreateIndex: true }
);

// Importer les routes
//Home
var homeRoutes = require("./parts/home.js");
app.use(homeRoutes);
// Connexion
var connexionRoutes = require("./parts/connexion.js");
app.use(connexionRoutes);
// Offers
const offersRoutes = require("./parts/Offer.js");
app.use(offersRoutes);
// MyOffers
const MyOffersRoutes = require("./parts/MyOffers.js");
app.use(MyOffersRoutes);

// Démarrer le serveur
app.listen(3000, function() {
  console.log("Server has started");
});
