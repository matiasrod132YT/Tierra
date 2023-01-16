const {PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const SuggestionSchema = require('../../../schemas/sugerencia/sugerencia');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {member, guildId, customId, message} = interaction;

        if(!interaction.isButton()) return;

        const embedd = new EmbedBuilder()
        .setColor("#FF3939")

        if (customId == 'sugerencia-aceptar' || customId == 'sugerencia-rechazar') {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))

                return interaction.reply({embeds: [embedd.setDescription('¡No tienes permiso para usar ese botón!')], ephemeral: true})

                SuggestionSchema.findOne({GuildId: guildId, MessageId: message.id}, async(err, data) => {
                    if (err) throw err;

                    if (!data)
                        return interaction.reply({embeds: [embedd.setDescription('No se encontraron datos!')], ephemeral: true})

                    const embed = message.embeds[0];

                    if (!embed)
                        return interaction.reply({embeds: [embedd.setDescription('No se encontraron embeds!')], ephemeral: true})

                    switch (customId) {
                        case 'sugerencia-aceptar':
                            embed.data.fields[1] = {name: 'Estatus', value: 'Aceptada!'}
                            const AcceptedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [AcceptedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Se acepto con éxito la sugerencia!')], ephemeral: true})
                            break;
                        case 'sugerencia-rechazar':
                            embed.data.fields[1] = {name: 'Estatus', value: 'Rechazada!'}
                            const DeclinedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [DeclinedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Se rechazo correctamente la sugerencia!')], ephemeral: true})
                    }
                })
        }
    }
}