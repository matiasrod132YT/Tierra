const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("carcel")
    .setDescription("Encarcela a un usuario")
    .addUserOption(option =>
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

    if (user) {
      let avatarURL = user.avatarURL({ size: 512, extension: "png" });
      let imagen = `https://some-random-api.ml/canvas/jail?avatar=${avatarURL}`;
  
      await interaction.reply({
        content: imagen,
      });
    }

    if (!user) {
      let avatarURL = interaction.user.avatarURL({ size: 512, extension: "png" });
      let imagen = `https://some-random-api.ml/canvas/jail?avatar=${avatarURL}`;
  
      await interaction.reply({
        content: imagen,
      });
    }
  },
};