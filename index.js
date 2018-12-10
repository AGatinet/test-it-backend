//Importer les dépendances
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Connecter la base de données
const mongoose = require("mongoose");
mongoose.connect(
	process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: "mongodb://heroku_fvvkbxfv:m7gb3ikcpt60e1v2shofr8gkb3@ds125680.mlab.com:25680/heroku_fvvkbxfv",
	{ useNewUrlParser: true, useCreateIndex: true }
);

// Importer les routes
//Home
var homeRoutes = require("./parts/home.js");
app.use(homeRoutes);
// Connexion
var connexionRoutes = require("./parts/connexion.js");
app.use(connexionRoutes);
const offersRoutes = require("./parts/Offer.js");
app.use(offersRoutes);
// MyOffers
const MyOffersRoutes = require("./parts/MyOffers.js");
app.use(MyOffersRoutes);
// Home
var homeRoutes = require("./parts/home.js");
app.use(homeRoutes);
// Publish
var publishRoutes = require("./parts/publish.js");
app.use(publishRoutes);
// Connexion
var connexionCompanyRoutes = require("./parts/connexionCompany.js");
app.use(connexionCompanyRoutes);

app.listen(process.env.PORT || 3001, function() {
	console.log("Server has started");
	console.log(process.env.PORT || 3001);
});
