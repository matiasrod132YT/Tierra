const { 
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    desarrollador: true,
    data: new SlashCommandBuilder()
    .setName("bot-servers")
    .setDescription("Servers que esta el bot"),

    async execute(interaction, client) {
        const servers = await client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .first(10);

        const servers2 = await servers.map((guild, index) => {
            return `**${index + 1})** ${guild.name} \`${guild.memberCount} miembros\``;
            }).join("\n")

        const embed = new EmbedBuilder()
        .setTitle(`Lista de Servidores`)
        .setDescription(`${servers2}`)
        .setColor(client.config.color)

        await interaction.reply({ embeds: [embed] })
    }
}