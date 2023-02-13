const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('server-banner')
    .setDescription('fetch a servers banner'),

    async execute(interaction, client) {
        const serverbanner = interaction.guild.bannerURL({ size: 1024 });

        const embed = new EmbedBuilder()
        .setDescription(`El server no tiene banner`)
        .setColor(client.config.color)

        if(!serverbanner) return interaction.reply({ embeds: [embed], ephemeral: true})

        const banner = new EmbedBuilder()
        .setAuthor({ name: `Banner de **${interaction.guild.name}**`})
        .setImage(serverbanner)

        await interaction.reply({ embeds: [banner] })
    }
};