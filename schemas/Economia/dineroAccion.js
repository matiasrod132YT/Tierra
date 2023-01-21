const { model, Schema } = require(`mongoose`);

let dineroSchema = new Schema({
    Guild: String,
    User: String,
    Daily: Number
});

module.exports = model("DineroAccion", dineroSchema)