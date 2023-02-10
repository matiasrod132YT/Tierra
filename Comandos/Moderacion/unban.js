const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const sancionesSchema = require('../../schemas/sanciones/sancionSchema');
const sancionesSetup = require('../../schemas/sanciones/sancionesSetup');
const ban = require("./ban");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Desbanea a un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName("idusuario")
                .setDescription("ID del usuario a desbanear.")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { channel, guildId, options } = interaction;

        const userId = options.getString("idusuario");

        const embed = new EmbedBuilder()
        .setTitle("🚪 | Usuario Desbaneado")
        .setDescription(`<@${userId}> fue desbaneado del servidor \n **Por:** <@${interaction.user.id}>`)
        .setColor(client.config.color)
        .setTimestamp();

        const embed2 = new EmbedBuilder()
        .setTitle(`**🚪 | El Desbaneo se realizo correctamente**`)
        .setColor(client.config.color)

        const errEmbed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("**¡Las sanciones no están configuradas en el servidor!**")

        const errEmbed2 = new EmbedBuilder()
        .setDescription(`**🚪 | Porfavor proporcione una ID válida.**`)
        .setColor(client.config.color)

        const errEmbed3 = new EmbedBuilder()
        .setDescription(`**Algo salio mal...**`)
        .setColor(client.config.color)

        sancionesSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (err)
            return interaction.reply({ embeds: [errEmbed2], ephemeral: true })

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if(isNaN(userId)) return await interaction.reply({ embeds: [errEmbed2], ephemeral: true});

            if (data) {
                const sancionesCanal = interaction.guild.channels.cache.get(data.ChannelId);

                try {
                    const m = await sancionesCanal.send({embeds: [embed], fetchReply: true});
                    await interaction.guild.members.unban(userId);
                    await interaction.reply({embeds: [embed2], ephemeral: true});
                    setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);

                    sancionesSchema.create({
                        GuildId: guildId,
                        MessageId: m.id
                    });
                } catch (err) {
                    console.log(err);
                    return await interaction.reply({ embeds: [errEmbed3], ephemeral: true });
                }
            }
        })
    }
}
