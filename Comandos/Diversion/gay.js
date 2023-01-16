const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("Bandera gay en el Avatar")
    .addUserOption((option) =>
      option.setName("usuario")
      .setDescription("Selecciona un usuario")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;

    const user = options.getUser("usuario");

    if (!user) {
      user = interaction.user;
    }

    let avatarURL = user.avatarURL({ size: 512, extension: "png" });
    let imagen = `https://some-random-api.ml/canvas/gay?avatar=${avatarURL}`;

    await interaction.reply({
      content: imagen,
    });
  },
};