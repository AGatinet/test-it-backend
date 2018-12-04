var CompanyOffersSchema = new mongoose.Schema({
  created: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }]
});

module.exports = mongoose.model(
  "CompanyOffers",
  CompanyOffersSchema,
  "CompanyOffers"
);
