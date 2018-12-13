const mongoose = require("mongoose");

const Offer = new mongoose.Schema({
	offerName: { type: String, required: true },
	creationDate: { type: Date, default: Date.now },
	deadlineInscription: { type: Date, required: true, default: Date.now },
	deadlineTest: { type: Date, required: true },
	duration: { type: String, required: true },
	picture: String,
	ageMin: { type: Number, default: 16 },
	ageMax: { type: Number, default: 100 },
	genderTarget: { type: String, default: "both" },
	adress: [
		// {
		// 	latitude: Number,
		// 	longitude: Number,
		// 	latitudeDelta: Number,
		// 	longitudeDelta: Number
		// },
		// { country: String },
		// { city: String },
		// { street: String },
		// { number: Number },
		// { postCode: Number }
	],
	description: String,
	wantedProfiles: { type: String, required: false },
	conditions: { type: String, required: false },
	availabilities: { type: Number, required: false },
	price: { type: Number, required: true },
	typeOffer: { type: String, required: true },
	industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
	criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }],
	listTesters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Company"
	}
});

module.exports = mongoose.model("Offer", Offer);
