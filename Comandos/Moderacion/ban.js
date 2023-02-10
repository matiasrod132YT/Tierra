const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const sancionesSchema = require('../../schemas/sanciones/sancionSchema');
const sancionesSetup = require('../../schemas/sanciones/sancionesSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Banea a un usuario del servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario a ser baneado.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon")
                .setDescription("Razon del ban.")
        ),

    async execute(interaction, client) {

        const user = options.getUser("usuario");
        const razon = options.getString("razon") || "Sin razon";
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new EmbedBuilder()
        .setTitle("🔨 | Usuario Baneado")
        .setDescription(`${user} fue baneado del servidor \n **→ Por:** <@${interaction.user.id}> \n **→ Razón:** ${razon} \n **→ id:** ${user.id}`)
        .setColor(client.config.color)
        .setTimestamp()

        const embed2 = new EmbedBuilder()
        .setTitle(`🔨 | El Ban se realizo correctamente`)
        .setColor(client.config.color)

        const errEmbed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("¡Las sanciones no están configuradas en el servidor!")

        const errEmbed2 = new EmbedBuilder()
        .setDescription(`🔨 | No puedes banear a ${user.username} ya que tienen un rol mayor.`)
        .setColor(client.config.color)
            
        const errEmbed3 = new EmbedBuilder()
        .setDescription(`**Algo salio mal...**`)
        .setColor(client.config.color)
        
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
                    const member = await interaction.guild.members.fetch(user.id);
                    await member.ban({ razon });
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