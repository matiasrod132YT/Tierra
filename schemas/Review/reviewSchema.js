const {model, Schema} = require('mongoose')

let reviewSchema = new Schema({
    GuildId: String,
    ChannelId: String
})

module.exports = model('review', reviewSchema)