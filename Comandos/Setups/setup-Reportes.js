const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js")
const reporteSchema = require("../../schemas/Reporte/reporteSchema")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-reportes")
    .setDescription("Establece un canal para reportes")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option
            .setName("canal")
            .setDescription("Selecciona un canal para reportes")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    ),

    async execute(interaction, client) {
        const { guildId, options } = interaction;
        const canal = options.getChannel("canal")

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)

        reporteSchema.findOne({ Guild: guildId}, async (err, data) => {

            if (!data) {
                await reporteSchema.create({
                    Guild: guildId,
                    Channel: canal.id
                })

                embed.setDescription(`El canal ${canal} ahora sera para reportes de usuarios`)

            } else if (data) {
                const c = client.channels.cache.get(data.Channel);
                embed.setDescription(`Tu sistema de reporte se a establecido en ${canal}`)
            }

            return await interaction.reply({ embeds: [embed]})
        })
    }
}