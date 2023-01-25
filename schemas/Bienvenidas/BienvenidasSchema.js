const { Schema, model } = require("mongoose");
const bienvenidaSchema = new Schema({
    guildId: String,
    channelId: String,
    descripcion: String,
    rol: String,
}, { versionKey: false });

module.exports = model('bienvenidaSchema', bienvenidaSchema);