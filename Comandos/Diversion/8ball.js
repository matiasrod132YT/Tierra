const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("8ball")
      .setDescription("8Ball")
      .addStringOption(option =>
        option.setName("pregunta")
            .setDescription("Pregunta lo que quieras")
            .setRequired(true)
    ),

    execute(interaction, client) {
      const { options } = interaction;
      const pregunta = options.getString("pregunta");

      let respuestas = ["Si", "No", "Talvez", "¿Puedes repetir la pregunta?", "Quien sabe", "Podria ser...", "Obvio", "Claro", "...", "No creo", "Si creo"]

      let respuesta = respuestas[Math.floor(Math.random() * respuestas.length)]

      const embed = new EmbedBuilder()
      .setTitle("8Ball")
      .setDescription(`**Tu pregunta** \n ${pregunta} \n\n **Respuesta** \n ${respuesta}`)
      .setColor(client.config.prefix)

      interaction.reply({embeds: [embed]});
    }
}