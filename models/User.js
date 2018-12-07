const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String, // Le token permettra d'authentifier l'utilisateur
  hash: String,
  salt: String,
  account: {
    firstName: String,
    lastName: String,
    age: Number,
    sex: String,
    address: {
      country: String,
      city: String,
      street: String,
      number: Number,
      postCode: Number
    },
    geolocation: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number
    },
    phone: String,
    bankAmount: Number,
    description: String,
    bankAccount: { bic: String, iban: String },
    photo: String,
    userOffers: {
      favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
      pendingValidation: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }
      ],
      pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
      history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }]
    },
    pendingPayment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
    criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }]
    // userOffers: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }
  }
});

module.exports = mongoose.model("User", UserSchema, "users");
