const { model, Schema } = require("mongoose");

let nivelSchema = new Schema({
    Guild: String,
    User: String,
    XP: Number,
    Level: Number
})

module.exports = model("Nivel", nivelSchema)