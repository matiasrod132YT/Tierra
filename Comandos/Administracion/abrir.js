const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");
const cerrarSchema = require("../../schemas/cerrar/cerrarSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("abrir")
    .setDescription("abre un canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const { guild, channel } = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)
        
        if(channel.permissionsFor(guild.id).has("SendMessages"))
        return interaction.reply({ embeds: [embed.setDescription("Este canal no esta cerrado")], ephemeral: true})

        channel.permissionOverwrites.edit(guild.id, {
            SendMessages: null,
        });

        await cerrarSchema.deleteOne({ ChannelID: channel.id })

        interaction.reply({ embeds: [embed.setDescription("Se a abierto denuevo el canal")]})

    }
}