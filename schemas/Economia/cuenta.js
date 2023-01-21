const {model, Schema} = require('mongoose')

let cuentaSchema = new Schema({
    Guild: String,
    User: String,
    Rank: Number,
    Wallet: Number
})

module.exports = model('cuenta', cuentaSchema)