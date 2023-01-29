const { model, Schema } = require("mongoose");

let pegajosoSchema = new Schema({
    Mensaje: String,
    CanalID: String,
    ultimoMensaje: String,
    ultimoMensajeId: String,
    maxContador: Number, default: 0,
    Contador: Number, default: 0
})

module.exports = model("pegajosoSchema", pegajosoSchema)