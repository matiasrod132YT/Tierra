const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const sancionesSchema = require('../../schemas/sanciones/sancionSchema');
const sancionesSetup = require('../../schemas/sanciones/sancionesSetup');
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutea a un usuario")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario a mutear")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon")
                .setDescription("¿Cuál es la razón del mute?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("tiempo")
                .setDescription("¿Cuánto tiempo de mute")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, guildId, options } = interaction;

        const user = options.getUser("usuario");
        const member = guild.members.cache.get(user.id);
        const tiempo = options.getString("tiempo");
        const convertedTime = ms(tiempo);
        const razon = options.getString("razon") || "Sin razón";

        const embed = new EmbedBuilder()
        .setTitle("🔈 | Usuario Muteado")
        .setDescription(`${user} fue muteado \n **Por:** <@${interaction.user.id}> \n **Razón:** ${razon} \n **Duracion:** ${tiempo}`)
        .setColor(client.config.color)
        .setTimestamp();

        const embed2 = new EmbedBuilder()
        .setTitle(`**🔈 | El Mute se realizo correctamente**`)
        .setColor(client.config.color)

        const errEmbed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("**¡Las sanciones no están configuradas en el servidor!**")

        const errEmbed2 = new EmbedBuilder()
        .setDescription('**Algo salio mal...**')
        .setColor(client.config.color)

        sancionesSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (err)
            return interaction.reply({ embeds: [errEmbed2], ephemeral: true })

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed2], ephemeral: true });

            if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed2], ephemeral: true });

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {
                const sancionesCanal = interaction.guild.channels.cache.get(data.ChannelId);

                try {
                    const m = await sancionesCanal.send({embeds: [embed], fetchReply: true});
                    await member.timeout(convertedTime, razon);
                    await interaction.reply({embeds: [embed2], ephemeral: true});
                    setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);

                    sancionesSchema.create({
                        GuildId: guildId,
                        MessageId: m.id
                    });
                } catch (err) {
                    console.log(err => {return});
                    return await interaction.reply({ embeds: [errEmbed2], ephemeral: true });
                }
            }
        })
    }
}