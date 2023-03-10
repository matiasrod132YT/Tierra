const { 
    EmbedBuilder,
    SlashCommandBuilder,
    ChannelType,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Informacion del servidor"),
    async execute(interaction, client) {
        const { guild } = interaction;
        const { createdTimestamp, ownerId, description, members, memberCount, premiumTier, premiumSubscriptionCount } = guild;
        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;
        const botCount = (await interaction.guild.members.fetch()).filter(member => member.user.bot).size;
        const icon = guild.iconURL({ size: 1024 });
        
        const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: icon })
                .setFields(
                    {
                        name: "ð Descripcion",
                        value: [
                            `${description || "No Tiene"}`,
                        ].join("\n")
                    },
                    {
                        name: "General",
                        value: [
                            `ð **Nombre** ${interaction.guild.name}`,
                            `ð¾ **ID** ${interaction.guild.id}`,
                            `ð **Creado** <t:${parseInt(createdTimestamp / 1000)}:R>`,
                            `ð **DueÃ±o** <@${ownerId}>`,
                        ].join("\n")
                    },
                    {
                        name: "Usuarios",
                        value: [
                            `ð¤ **Miembros** ${members.cache.filter((m) => !m.user.bot).size}`,
                            `ð¤ **Bots** ${botCount}`,
                            `ð¥ **Total** ${memberCount}`,
                        ].join("\n")
                    },
                    {
                        name: "Canales",
                        value: [
                            `ð¬ **texto** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews])}`,
                            `ð **Voz** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                            `ð **Foros** ${getChannelTypeSize([ChannelType.GuildForum])}`,
                            `ð§µ **Hilos** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                            `ð **Categoria** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
                            `ð» **Escenarios** ${getChannelTypeSize([ChannelType.GuildStageVoice])}`,
                        ].join("\n"),
                        inline: true
                    },
                    {
                        name: "Emojis",
                        value: [
                            `ð **Emojis** ${guild.emojis.cache.size}`,
                            `ð **Emojis** ${guild.emojis.cache.size}`,
                        ].join("\n"),
                        inline: true
                    },
                    {
                        name: "Nitro",
                        value: [
                            `ð° **Nivel** ${premiumTier}`,
                            `ð® **Boost** ${premiumSubscriptionCount}`,
                        ].join("\n"),
                        inline: true
                    },
                )
                .setFooter({ text: `Solicitado por: ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setThumbnail(icon)
                .setColor(client.config.color)
            interaction.reply({ embeds: [embed]});
    }
};