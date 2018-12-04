var mongoose = require("mongoose");

var Offer = new mongoose.Schema({
  offerName: { type: String, required: true },
  creationDate: { type: Date, required: false, default: Date.now },
  deadlineInscription: { type: Date, required: true, default: Date.now },
  dateFinalTest: { type: Date, required: true },
  duration: { type: Number, required: true },
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
  description: String,
  availabilities: { type: Number, required: true },
  price: { type: Number, required: true },
  typeOffer: { type: String, required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
  criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }],
  listTesters: [
    {
      status: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  }
});

module.exports = mongoose.model("Offer", OfferSchema);
