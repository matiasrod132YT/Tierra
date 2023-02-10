const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("dice")
      .setDescription("Dice lo que digas")
      .addStringOption(option =>
        option.setName("dice")
            .setDescription("Dice lo que digas")
            .setRequired(true)
    ),

    execute(interaction, client) {
      const { options } = interaction;
      const descripcion = options.getString("dice");

      const embed = new EmbedBuilder()
      .setDescription(descripcion)
      .setColor(client.config.color)

      interaction.reply({embeds: [embed]});
    }
}