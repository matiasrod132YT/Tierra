const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName(`test`)
    .setDescription(`Test de comandos`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `https://discord.gg/J5CPZajN` })
        .setTitle(`Test`)
        .setURL(`https://discord.gg/J5CPZajN`)
        .setDescription(`Esto es un test`)
        .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
        .addFields(
            { name: `Esto es un test`, value: `Esto es un test` },
            { name: `\u200B`, value: `\u200B` },
            { name: `Esto es un test`, value: `Esto es un test`, inline: true },
            { name: `Esto es un test`, value: `Esto es un test`, inline: true },
        )
        .setImage(interaction.user.displayAvatarURL({ size: 512}))
        .setFooter({ text: `Esto es un test`, iconURL: `${interaction.user.displayAvatarURL({ size: 512})}` })
        .setTimestamp()
        .setColor(client.config.color)

        await interaction.reply({ embeds: [embed] })
    }
}