const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`prendido`)
    .setDescription(`Cuanto tiempo a estado prendido el bot`),

    async execute(interaction, client) {
        const dias = Math.floor(client.uptime / 86400000)
        const horas = Math.floor(client.uptime / 3600000) % 24
        const minutos = Math.floor(client.uptime / 60000) % 60
        const segundos = Math.floor(client.uptime / 1000) % 60

        const embed = new EmbedBuilder()
        .setTitle(`__Tiempo Prendido ${client.user.username}__`)
        .addFields(
            { name: "Prendido", value: ` \`${dias}\` Dias, \`${horas}\` Horas, \`${minutos}\` Minutos y \`${segundos}\` Segundos.`}
        )
        .setTimestamp()
        .setColor(client.config.prefix)

        interaction.reply({ embeds: [embed] })
    }
}