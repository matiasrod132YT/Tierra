const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");
const cerrarSchema = require("../../schemas/cerrar/cerrarSchema");
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("cerrar")
    .setDescription("Cierra un canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) => option
        .setName("tiempo")
        .setDescription("Tiempo para cerrar el canal: (1m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("razon")
        .setDescription("Razon del cierre")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { guild, channel, options } = interaction;

        const razon = options.getString("razon") || "No hay una razon";
        const tiempo = options.getString("tiempo") || "No hay tiempo definido / Infinito"

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)

        if(!channel.permissionsFor(guild.id).has("SendMessages"))
        return interaction.reply({ embeds: [embed.setDescription("Este canal esta cerrado")], ephemeral: true})

        channel.permissionOverwrites.edit(guild.id, {
            SendMessages: false,
        })

        interaction.reply({ embeds: [embed.setDescription(`Este canal esta cerrado por ${tiempo}, Razon ${razon}`)]})

        const tiempos = options.getString("tiempo")
        if (tiempos) {
            const ExpireDate = Date.now() + ms(tiempos);
            cerrarSchema.create({
                GuildID: guild.id,
                ChannelID: channel.id,
                Tiempo: ExpireDate,
            });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SendMessages: null,
                });

                interaction.editReply({ embeds: [embed.setDescription("Se a terminado el tiempo, Se volvio a abrir el canal.")
                ]
            })
            .catch(() => {});

            await cerrarSchema.deleteOne({ ChannelID: channel.id })
            }, ms(tiempos))
        }
    }
}