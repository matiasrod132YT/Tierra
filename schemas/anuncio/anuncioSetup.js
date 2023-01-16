const {model, Schema} = require('mongoose')

let anuncioSetup = new Schema({
    GuildId: String,
    ChannelId: String,
    MencionId: String,
})

module.exports = model('anuncioSetup', anuncioSetup)