const { Schema, model } = require("mongoose");
const welcomeSchema = new Schema({
    guildId: String,
    channelId: String,
    descripcion: String,
    rol: String,
}, { versionKey: false });

module.exports = model('welcomeSchema', welcomeSchema);