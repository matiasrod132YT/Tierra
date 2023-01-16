const { Schema, model } = require("mongoose");
const verificacionSchema = new Schema({
  guildId: String,
  rol: String,
});

module.exports = model("verificacionSchema", verificacionSchema, "verificacionSchema");