var UserOffersSchema = new mongoose.Schema({
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  pendingValidation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  pendingPayment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }]
});

module.exports = mongoose.model("UserOffers", UserOffersSchema, "UserOffers");
