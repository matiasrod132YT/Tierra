const { model, Schema } = require("mongoose");

let cerrarSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    Tiempo: String
})

module.exports = model("cerrar", cerrarSchema)