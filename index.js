//importer les dépendances

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const mongoose = require("mongoose");
mongoose.connect(
	process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: "mongodb://localhost:27017/test-it",
	{ useNewUrlParser: true, useCreateIndex: true }
);

// routes

var connexionRoutes = require("./parts/connexion.js");
app.use(connexionRoutes);

app.listen(process.env.MONGODB_URI || 3000, function() {
	console.log("Server has started");
});
