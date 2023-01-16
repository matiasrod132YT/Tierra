const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "Este comando esta desactualizado",
        ephermal: true
      });

    if (command.developer && interaction.user.id !== "838592851608338462")
      return interaction.reply({
        content: "Este comando es solo para el developer",
        ephermal: true
      });

    command.execute(interaction, client);
  },
};