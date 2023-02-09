const { Schema, model } = require("mongoose")

const reporteSchema = new Schema({
  Guild: String,
  Channel: String,
  Msg: String,
  Role: String,
})

module.exports = model("reporte", reporteSchema)