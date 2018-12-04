var CriteriaSchema = new mongoose.Schema({
  name: String,
  industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" }
});
module.exports = mongoose.model("Criteria", CriteriaSchema, "Criterias");
