const {model, Schema} = require('mongoose')

let sancionesSchema = new Schema({
    GuildId: String,
    MessageId: String,
});

module.exports = model('sanciones', sancionesSchema)