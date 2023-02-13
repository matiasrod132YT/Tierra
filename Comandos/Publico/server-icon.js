const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-icon')
        .setDescription('Icono del servidor'),
    async execute(interaction, client) {

        const servericon = interaction.guild.iconURL({ size: 1024})

        const errembed = new EmbedBuilder()
        .setDescription(`Este server no tiene icono`)
        .setColor(client.config.color)

        if (!servericon) return interaction.reply({ embeds: [errembed], ephemeral: true });

        const embed = new EmbedBuilder()
        .setTitle(`Icono de **${interaction.guild.name}**`)
        .setImage(servericon)
        .setColor(client.config.color)

        await interaction.reply({ embeds: [embed] });
    }
};