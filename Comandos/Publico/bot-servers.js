const { 
    EmbedBuilder,
    SlashCommandBuilder,
    ChannelType,
    Client,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-servers")
        .setDescription("Servers que esta el bot"),
    async execute(interaction, client) {
        const servers = await client.guilds.fetch()
        const servers2 = await servers.map((g) => g.name).join("\n")

        const embed = new EmbedBuilder()
        .setTitle(`Lista de Servidores`)
        .setDescription(`${servers2}`)
        .setColor(client.config.color)

        await interaction.reply({ embeds: [embed] })
    }
}