const { model, Schema } = require("mongoose");

let nivelStatusSchema = new Schema({
    GuildID: String,
    status: { type: Boolean, default: false }
})

module.exports = model("NivelStatus", nivelStatusSchema)