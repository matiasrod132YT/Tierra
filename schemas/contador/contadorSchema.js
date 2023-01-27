const {model, Schema} = require('mongoose')

let contadorSchema = new Schema({
    GuildID: String,
    Canal: String,
    Contador: Number
})

module.exports = model('contador', contadorSchema)