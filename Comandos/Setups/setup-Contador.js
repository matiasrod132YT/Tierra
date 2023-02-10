const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const contadorSchema = require("../../schemas/contador/contadorSchema")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName(`setup-contador`)
    .setDescription(`Configura el sistema de contador`)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option
            .setName(`canal`)
            .setDescription(`Canal para el sistema de contador`)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    ),

    async execute(interaction, client) {
        const { options, guildId, guild, user, member } = interaction;

        const canal = options.getChannel("canal")

        const errembed = new EmbedBuilder()
        .setTitle(`🔢 | Contador`)
        .setDescription(`Algo salio mal...`)
        .setColor(client.config.color)

        const embed = new EmbedBuilder()
        .setTitle(`🔢 | Contador`)
        .setDescription(`Se a creado con exito el sistema de contador en ${canal}`)
        .setTimestamp()
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setTitle(`🔢 | Contador`)
        .setDescription(`Se a remplazado con exito el anterior canal en ${canal}`)
        .setTimestamp()
        .setColor(client.config.color)

        contadorSchema.findOne({ GuildID: guildId }, async (err, data) => {
            if(!data) {
            await contadorSchema.create({
                GuildID: guildId,
                Canal: canal.id,
                Contador: 1,
                UltimaPersona: ""
            });
            return interaction.reply({ embeds: [embed], ephemeral: true })

        } else if (!data) {
            data.Canal = canal.id
            data.save()

            return interaction.reply({ embeds: [embed2], ephemeral: true })
        }
        if (err) {
            return interaction.reply({ embeds: [errembed], ephemeral: true })
        }
        });
    }
}