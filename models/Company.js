var CompanySchema = new mongoose.Schema({
  name: String,
  mail: String,
  password: String,
  token: String,
  hash: String,
  salt: String,
  companyAccount: {
    companyName: String,

    companyPhone: String,
    companyLogo: [String],
    companyIndustry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry"
    },
    companyAdress: [
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
    ]
  },
  companyOffers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyOffers"
  }
});
module.exports = mongoose.model("Company", CompanySchema, "companies");
