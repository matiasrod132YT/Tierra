const {model, Schema} = require('mongoose')

let SugerenciaSchema = new Schema({
    GuildId: String,
    MessageId: String,
    Details: Array
});

module.exports = model('Sugerencia', SugerenciaSchema)