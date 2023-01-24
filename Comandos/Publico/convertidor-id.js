const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('convertidor-id')
    .setDescription('Convierte cualquier ID a su fecha de creación.')
    .addStringOption(option => option.setName('id').setDescription('Id a convertir (Usuario, bot, servidor, canal, categoria, mensaje.').setRequired(true)),
    async execute (interaction, client) {
        const ID = interaction.options.getString('id');
        const unixEpoch = 1420070400000;
        let bin = Number(ID).toString(2);
        bin = `0000${bin}`;
        let res = '';
        for (let i = 0; i < 42; i++) {
            res = `${res}${bin[i]}`;
        }
        res = parseInt(res, 2);
        res = Number(res) + unixEpoch;
        res = Math.floor(res / 1000);
        
        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Convertidor de ID', iconURL: "https://cdn.discordapp.com/attachments/1031976168154480701/1059925925057277982/iconBotDev.png"})
        .addFields(
            { name: "**Fecha de creación:**", value: `<t:${res}>`, inline: true},
            { name: "**Sintaxis de chat:**", value: `**\`<t:${res}>\`**`, inline: true},
            )
        .setTimestamp()
        .setColor(client.config.prefix)

        await interaction.reply({ embeds: [embed], ephemeral: false});
    }
}