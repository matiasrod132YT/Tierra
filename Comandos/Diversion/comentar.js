const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comentar")
    .setDescription("Comenta algo en youtube")
    .addStringOption(option =>
      option.setName("comentario")
      .setDescription("Comentario que quieres poner")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;

    const comentario = options.getString("comentario")

    let avatarURL = interaction.user.avatarURL({ size: 512, extension: "png" });
    let imagen = `https://some-random-api.ml/canvas/youtube-comment?avatar=${avatarURL}&comment=${comentario}&username=${interaction.user.tag}`;

    await interaction.reply({
      content: imagen,
    });
  },
};