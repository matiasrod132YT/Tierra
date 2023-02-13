const { Schema, model } = require("mongoose");

const notasSchema = new Schema({
  _id: Schema.Types.ObjectId,
  Guild: String,
  User: String,
  Nota: String,
  Staff: String,
  Tiempo: String,
});

module.exports = model("notasSchema", notasSchema);