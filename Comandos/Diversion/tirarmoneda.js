const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("tirarmoneda")
      .setDescription("Tira una moneda cara o sello"),

    execute(interaction, client) { 
      let respuestas = ["CARA", "SELLO"]

      let respuesta = respuestas[Math.floor(Math.random() * respuestas.length)]

      const embed = new EmbedBuilder()
      .setTitle("🔁Tirar Moneda")
      .setDescription(`Se tiro la moneda y salio ${respuesta}`)
      .setFooter({ text: `Solicitado por: ${interaction.user.tag}`})
      .setColor(client.config.color)

      interaction.reply({embeds: [embed]});
    }
}