const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName(`test`)
    .setDescription(`Test de comandos`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
        .setTitle(`Test`)
        .setDescription(`Esto es un test`)
        .setTimestamp()
        .setColor(client.config.prefix)

    }
}