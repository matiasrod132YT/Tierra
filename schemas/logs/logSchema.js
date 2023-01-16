const mongoose = require("mongoose")

const clog = mongoose.Schema({

  Guild: String,
    
  Channel: String
})

module.exports = mongoose.model("clog", clog)