const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const sancionesSchema = require('../../schemas/sanciones/sancionSchema');
const sancionesSetup = require('../../schemas/sanciones/sancionesSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kickear un usuario")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario a ser kickeado.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon")
                .setDescription("Razon del kick.")
        ),

    async execute(interaction, client) {
        const { channel, guildId, options } = interaction;

        const user = options.getUser("usuario");
        const razon = options.getString("razon") || "Sin razón";
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new EmbedBuilder()
        .setTitle("👞 | Usuario Kickeado")
        .setDescription(`${user} fue kickeado del servidor \n **→ Razón:** ${razon} \n **→ Por:** <@${interaction.user.id}>`)
        .setColor(client.config.prefix)
        .setTimestamp()

        const embed2 = new EmbedBuilder()
        .setTitle(`**👞 | El Kick se realizo correctamente**`)
        .setColor(client.config.prefix)

        const errEmbed = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setDescription("**¡Las sanciones no están configuradas en el servidor!**")

        const errEmbed2 = new EmbedBuilder()
        .setDescription(`**👞 | No puedes kickear a ${user.username} ya que tienen un rol mayor.**`)
        .setColor(client.config.prefix)

        sancionesSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {
                const sancionesCanal = interaction.guild.channels.cache.get(data.ChannelId);
            
            if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed2], ephemeral: true });

                try {
                    const m = await sancionesCanal.send({embeds: [embed], fetchReply: true});
                    await member.kick(razon);
                    await interaction.reply({embeds: [embed2], ephemeral: true});
                    setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);

                    sancionesSchema.create({
                        GuildId: guildId,
                        MessageId: m.id
                    });
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}