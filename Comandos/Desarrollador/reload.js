const { chatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");

const { loadCommands } = require("../../Handlers/commandHandler");
const { loadEvents } = require("../../Handlers/eventHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Recarga los comandos y eventos")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(options => options
        .setName("eventos")
        .setDescription("Recarga los eventos")
    )
    .addSubcommand(options => options
        .setName("comandos")
        .setDescription("Recarga los comandos")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "eventos": {
                for (const [key, value] of client.events)
                client.removeListener(`${key}`, value, true);
                loadEvents(client);
                interaction.reply({content: `Tus eventos fueron recargados con exito`, ephemeral: true})
            }
                
                break;
            case "comandos": {
                loadCommands(client);
                interaction.reply({content: `Tus comandos fueron recargados con exito`, ephemeral: true})
            }
                break;
        }
    },
}