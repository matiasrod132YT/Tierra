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

    const cooldownData = `${interaction.user.id}/${interaction.commandName}`;

    if (client.cooldown.has(cooldownData)) {
      const time = ms(client.cooldown.get(cooldownData) - Date.now());

      return interaction.reply({ content: `⏰ | Para volver a ejecutar este comando debes esperar ${time}!`, ephemeral: true }),
      setTimeout(function(){interaction.deleteReply()}, 5000);
    }

    interaction.setCooldown = async (time) => {
      client.cooldown.set(cooldownData, Date.now() + time);
      setTimeout(() => client.cooldown.delete(cooldownData), time);
    };

    command.execute(interaction, client);
  },
};