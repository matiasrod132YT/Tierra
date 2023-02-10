const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Te respondere Pong!!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    const embed = new EmbedBuilder()
        .setTitle("PING")
        .setDescription(`**Ping del bot:** ${client.ws.ping}MS`)
        .setColor(client.config.color)
      interaction.reply({embeds: [embed]});
  }
};