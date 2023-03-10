const { 
    EmbedBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    ChannelType,
    UserFlags,
    version
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-info")
        .setDescription("Informacion del bot"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        await client.application.fetch();
        const formatter = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });
        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;
        const embed = new EmbedBuilder()
                .setTitle(`Info de ${client.user.username}`)
                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                .addFields(
                    { name: "Descripcion", value: `ð ${client.application.description || "Nada"}` },
                    {
                        name: "General",
                        value: [
                            `ð©ð»âð§ **Cliente** ${client.user.tag}`,
                            `ð³ **ID** ${client.user.id}`,
                            `ð **Creado** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
                            `ð **DueÃ±o** ${client.application.owner ? `<@${client.application.owner.id}> (${client.application.owner.tag})` : "Nadie"}`,
                            `â **Verificado** ${client.user.flags & UserFlags.VerifiedBot ? "Si" : "No"}`,
                            `ð· **Tags** ${client.application.tags.length ? formatter.format(client.application.tags.map(tag => `*${tag}*`)) : "Nada"}`,
                            `ð **Comandos** ${client.commands.size}`,
                            ``,
                            `ð **Servidores** ${client.guilds.cache.size}`,
                        ].join("\n")
                    },
                    {
                        name: "Sistema",
                        value: [
                            `â° **Prendido** <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                            `ð **Ping** ${client.ws.ping}ms`,
                            `ð¾ **CPU** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`,
                            `ð©ð»âð§ **Node.js** ${process.version}`,
                            `ð  **Discord.js** ${version}`


                        ].join("\n"),
                        inline: true
                    }
                )
                .setColor(client.config.color)
            interaction.reply({ embeds: [embed]});
    }
};
