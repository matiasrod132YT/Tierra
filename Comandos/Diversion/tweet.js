const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tweet")
    .setDescription("Twittea algo")
    .addStringOption(option =>
      option.setName("tweet")
      .setDescription("Tweet que quieras poner")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;

    const tweet = options.getString("tweet")

    let avatarURL = interaction.user.avatarURL({ size: 512, extension: "png" });
    let imagen = `https://some-random-api.ml/canvas/tweet?avatar=${avatarURL}&comment=${tweet}&username=${interaction.user.username}&displayname=${interaction.user.username}`;

    await interaction.reply({
      content: imagen,
    });
  },
};