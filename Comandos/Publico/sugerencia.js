const { ActionRowBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandAttachmentOption} = require('discord.js')
const SuggestionSchema = require('../../schemas/sugerencia/sugerencia')
const sugerenciaSetup = require('../../schemas/sugerencia/sugerenciaSetup')

module.exports = {
    data: new SlashCommandBuilder()
      .setName("sugerir")
      .setDescription("Sugiere algo al servidor")
      .addStringOption(option =>
        option.setName("sugerencia")
            .setDescription("Sugerencia para el servidor.")
            .setRequired(true)
    ),

    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const sugerencia = options.getString("sugerencia");

        const embed = new EmbedBuilder()
        .setAuthor({ name: `Sugerencia de ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}`})
        .addFields(
            {name: 'Sugerencia:', value: sugerencia, inline: false},
            {name: 'Estatus:', value: 'Pendiente...', inline: false},
        )
        .setTimestamp()
        .setColor(client.config.color)

        const errEmbed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("¡Las sugerencias no están configuradas en el servidor!")

        const embed2 = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription('¡Se envió con éxito la sugerencia!')

        sugerenciaSetup.findOne({GuildId: guildId}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {
                const suggestionChannel = interaction.guild.channels.cache.get(data.ChannelId);

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('sugerencia-aceptar').setLabel('Aceptar').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('sugerencia-rechazar').setLabel('rechazar').setStyle(ButtonStyle.Danger),
                );

                try {
                    const m = await suggestionChannel.send({embeds: [embed], components: [buttons], fetchReply: true});
                    await interaction.reply({embeds: [embed2], ephemeral: true});
                    await m.react("✅");
                    await m.react("❌");
                
                    SuggestionSchema.create({
                        GuildId: interaction.guild.id,
                        MessageId: m.id,
                        Details: sugerencia,
                    })

                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}