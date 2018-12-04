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
    adress: [
      {
        latitude: Number,
        longitude: Number,
        latitudeDelta: Number,
        longitudeDelta: Number
      },
      { country: String },
      { city: String },
      { street: String },
      { number: Number },
      { postCode: Number }
    ],
    phone: String,
    bankAmount: Number,
    description: String,
    bankAccount: { bic: String, iban: String },
    photo: String,
    criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }],
    userOffers: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }
  }
});

module.exports = mongoose.model("User", UserSchema, "users");
