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
                    { name: "Descripcion", value: `📝 ${client.application.description || "Nada"}` },
                    {
                        name: "General",
                        value: [
                            `👩🏻‍🔧 **Cliente** ${client.user.tag}`,
                            `💳 **ID** ${client.user.id}`,
                            `📆 **Creado** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
                            `👑 **Dueño** ${client.application.owner ? `<@${client.application.owner.id}> (${client.application.owner.tag})` : "Nadie"}`,
                            `✅ **Verificado** ${client.user.flags & UserFlags.VerifiedBot ? "Si" : "No"}`,
                            `🏷 **Tags** ${client.application.tags.length ? formatter.format(client.application.tags.map(tag => `*${tag}*`)) : "Nada"}`,
                            `🔗 **Comandos** ${client.commands.size}`,
                            ``,
                            `🌍 **Servidores** ${client.guilds.cache.size}`,
                        ].join("\n")
                    },
                    {
                        name: "Sistema",
                        value: [
                            `⏰ **Prendido** <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                            `🏓 **Ping** ${client.ws.ping}ms`,
                            `💾 **CPU** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`,
                            `👩🏻‍🔧 **Node.js** ${process.version}`,
                            `🛠 **Discord.js** ${version}`


                        ].join("\n"),
                        inline: true
                    }
                )
                .setColor(client.config.color)
            interaction.reply({ embeds: [embed]});
    }
};
