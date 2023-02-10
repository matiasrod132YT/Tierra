const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("dados")
      .setDescription("Dados"),

    execute(interaction, client) { 
      let respuestas = ["1", "2", "3", "4", "5", "6"]

      let respuesta = respuestas[Math.floor(Math.random() * respuestas.length)]

      const embed = new EmbedBuilder()
      .setTitle("🎲Dados")
      .setDescription(`Se tiro el dado y salio ${respuesta}`)
      .setFooter({ text: `Solicitado por: ${interaction.user.tag}`})
      .setColor(client.config.color)

      interaction.reply({embeds: [embed]});
    }
}