const { model, Schema } = require("mongoose")

module.exports = model("adivina-numero", new Schema({
    
    Guild: String,
    Channel: String,
    number: Number

}))