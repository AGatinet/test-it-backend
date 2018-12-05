var mongoose = require("mongoose");

var Offer = new mongoose.Schema({
	offerName: { type: String, required: true },
	creationDate: { type: Date, required: false, default: Date.now },
	deadlineInscription: { type: Date, required: true, default: Date.now },
	deadlineTest: { type: Date, required: true },
	duration: { type: Number, required: true },
	picture: String,
	ageMin: { type: Number, default: 16 },
	ageMax: { type: Number, default: 100 },
	genderTarget: { type: String, default: "both" },
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
	wantedProfiles: { type: String, required: true },
	conditions: { type: String, required: true },
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

module.exports = mongoose.model("Offer", Offer);
