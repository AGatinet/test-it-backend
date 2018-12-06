// Model offer
const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  offerName: { type: String, required: true },
  creationDate: { type: Date, required: false, default: Date.now },
  deadlineInscription: { type: Date, required: false },
  deadlineTest: { type: Date, required: false },
  duration: { type: String, required: true },
  picture: { type: String, required: false },
  ageMin: { type: Number, default: 16 },
  ageMax: { type: Number, default: 100 },
  genderTarget: { type: String, default: "both" },
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
  description: { type: String, required: true },
  wantedProfiles: { type: String, required: true },
  conditions: { type: String, required: true },
  availabilities: { type: Number, required: true },
  price: { type: Number, required: true },
  typeOffer: { type: String, required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
  criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }],
  listTesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  }
});

module.exports = mongoose.model("Offer", OfferSchema);
