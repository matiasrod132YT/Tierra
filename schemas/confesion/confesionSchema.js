const {model, Schema} = require('mongoose')

let confesionSchema = new Schema({
    GuildId: String,
    ChannelId: String
})

module.exports = model('confesion', confesionSchema)