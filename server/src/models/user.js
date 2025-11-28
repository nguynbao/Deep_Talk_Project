const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, require: true },
  avtUrl: { type: String },
});
module.exports = mongoose.model("User", userSchema);
