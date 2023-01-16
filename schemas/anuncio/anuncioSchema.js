const {model, Schema} = require('mongoose')

let anuncioSchema = new Schema({
    GuildId: String,
    MessageId: String,
});

module.exports = model('anuncios', anuncioSchema)