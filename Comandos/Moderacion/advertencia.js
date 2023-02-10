const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const warningSchema = require("../../schemas/warn/warnSchema");
const sancionesSetup = require("../../schemas/sanciones/sancionesSetup")
const sancionesSchema = require("../../schemas/sanciones/sancionSchema")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("advertencia")
    .setDescription("Advierte a un usuario")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option.setName("usuario")
            .setDescription("Usuario a ser advertido")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("razon")
            .setDescription("Razon de la advertencia")
            .setRequired(false)
    ),
    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const usuario = options.getUser("usuario");
        const razon = options.getString("razon");

        const userTag = `${usuario.username}#${usuario.discriminator}`

        warningSchema.findOne({ GuildID: guildId, UserID: usuario.id, UserTag: userTag }, async (err, data) => {
            if (err) throw err;

            if(!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: usuario.id,
                    UserTag: userTag,
                    content: [
                        {
                            ExecuterId: usuario.id,
                            ExecuterTag: usuario.tag,
                            Reason: razon
                        }
                    ],
                });
            } else {
                const warnContent = {
                    ExecuterId: usuario.id,
                    ExecuterTag: usuario.tag,
                    Reason: razon
                }
                data.Content.push(warnContent);
            }
            data.save()

            sancionesSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setTitle(`⚠️ | Usuario Advertido`)
                .setDescription(`${usuario} fue **advertido**\n**Por:** <@${interaction.user.id}>\n**→ Razón:** ${razon}\n**→ Staff**: <@${interaction.user.id}>`)
                .setColor(client.config.color)

                const embed2 = new EmbedBuilder()
                .setTitle(`⚠️ | La Advertencia se realizo correctamente`)
                .setColor(client.config.color)

                const embed3 = new EmbedBuilder()
                .setDescription(`⚠️ | Haz sido **advertido** en ${interaction.guild.name} | ${razon}`)
                .setColor(client.config.color)

                const errEmbed = new EmbedBuilder()
                .setDescription("**¡Las sanciones no están configuradas en el servidor!**")
                .setColor(client.config.color)

                if (err) throw err;
    
                if (!data) {
                    return interaction.reply({embeds: [errEmbed], ephemeral: true})
                }
    
                if (data) {
                    const sancionesCanal = interaction.guild.channels.cache.get(data.ChannelId);

                    try {
                        const m = await sancionesCanal.send({embeds: [embed], fetchReply: true});
                        await interaction.reply({embeds: [embed2], ephemeral: true});
                        setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);
                        await usuario.send({ embeds: [embed3] }).catch(err => {
                            return;
                        });
    
                        sancionesSchema.create({
                            GuildId: guildId,
                            MessageId: m.id
                        });
                    } catch (err) {
                        console.log(err)
                    }
                }
            })
        });
    }
}