const {model, Schema} = require('mongoose')

let sancionesSetup = new Schema({
    GuildId: String,
    ChannelId: String
})

module.exports = model('sancionesSetup', sancionesSetup)