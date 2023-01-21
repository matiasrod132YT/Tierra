const {model, Schema} = require('mongoose')

let cuentaSchema = new Schema({
    Guild: String,
    User: String,
    Bank: Number,
    Wallet: Number
})

module.exports = model('cuenta', cuentaSchema)