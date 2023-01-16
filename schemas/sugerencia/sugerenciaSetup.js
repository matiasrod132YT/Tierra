const {model, Schema} = require('mongoose')

let SugerenciaSetup = new Schema({
    GuildId: String,
    ChannelId: String
})

module.exports = model('SugerirSetup', SugerenciaSetup)