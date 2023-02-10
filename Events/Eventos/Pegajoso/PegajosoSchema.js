const { EmbedBuilder } = require("discord.js");
const pegajosoSchema = require("../../../schemas/pegajoso/pegajosoSchema");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.author.bot) return;

    pegajosoSchema.findOne({ CanalID: message.channel.id}, async (err, data) => {
      if (err) throw err;
  
      if (!data) {
        return;
      }
  
      let canal = data.CanalID;
      let cacheCanal = client.channels.cache.get(canal);
  
      const embed = new EmbedBuilder()
      .setDescription(data.Mensaje)
      .setFooter({ text: "Esto es un mensaje pegajoso"})
      .setColor(client.config.color)
  
      if (message.channel.id == canal) {
        data.Contador += 1;
        data.save();
  
        if (data.Contador >= data.maxContador) {
          client.channels.cache.get(canal).messages.fetch(data.ultimoMensajeId).then(async(m) => {
            m.delete();
          })
  
          let nuevoMensaje = await cacheCanal.send({ embeds: [embed] });
  
          data.ultimoMensajeId = nuevoMensaje.id;
          data.Contador = 0;
          data.save();
        }
      }
    })
  }  
}