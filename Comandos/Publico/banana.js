const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`banana`)
    .setDescription(`Mira cuanto mide tu banana`),

    async execute(interaction, client) {

        const mide = Math.floor(Math.random() * 17) + 3;

        const embed = new EmbedBuilder()
        .setTitle(`🍌 Banana de ${interaction.user.username} 🍌`)
        .setDescription(`La banana de ${interaction.user} mide ${mide} centímetros. 😋`)
        .setImage(`https://media.discordapp.net/attachments/876553669380821003/972541256796352532/IMG_7125.jpg?width=360&height=360`)
        .setFooter({ text: `Solicitado por ${interaction.user}`, iconURL: interaction.user.displayAvatarURL({dynamic: true}) })
        .setTimestamp()
        .setColor(client.config.color)

        await interaction.reply({ embeds: [embed] })
    }
}