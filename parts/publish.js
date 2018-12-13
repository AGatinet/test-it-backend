const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");
const CompanyOffers = require("../models/CompanyOffers");
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

app.post("/publish", function(req, res) {
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
        creationDate: req.body.creationDate,
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
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = app;
