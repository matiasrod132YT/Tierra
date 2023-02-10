const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const warningSchema = require("../../schemas/warn/warnSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("eliminar-advertencias")
    .setDescription("Elimina una advertencia de un usuario")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option.setName("usuario")
            .setDescription("Usuario que quieres eliminar advertencias")
            .setRequired(true)
    ),
    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const usuario = options.getUser("usuario");

        const embed = new EmbedBuilder()
        .setDescription(`**⚠️ | Las advertencias de ${usuario.tag} fueron eliminadas**`)
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setDescription(`**⚠️ | ${usuario.tag} no tiene advertencias para eliminar**`)
        .setColor(client.config.color)

        warningSchema.findOne({ GuildID: guildId, UserID: usuario.id, UserTag: usuario.tag }, async (err, data) => {
            if (err) throw err;
            
            if (data) {
                await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: usuario.id, UserTag: usuario.tag})

                interaction.reply({ embeds: [embed] });
                setTimeout(function(){interaction.deleteReply({ embeds: [embed] })}, 5000);
            } else {
                interaction.reply({ embeds: [embed2], ephemeral: true })
                setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);
            }
        });
    }
}