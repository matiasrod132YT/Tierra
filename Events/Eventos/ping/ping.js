const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        if (message.content === `<@${client.user.id}>`) {

            const embed = new EmbedBuilder()
            .setTitle(`Ayuda de ${client.user.username}`)
            .setDescription(`• Prefix: \`/\`\n• Comandos: \`/help\``)
            .setTimestamp()
            .setColor(client.config.color)

            message.channel.send({ embeds: [embed] })
        } else {
            return;
        }
    }
}