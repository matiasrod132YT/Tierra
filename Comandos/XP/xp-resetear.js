const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-resetear`)
    .setDescription(`Resetea el XP del servidor`)
    .setDefaultMemberPermissions(PermissionsBitField.Administrator),
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const { guildId } = interaction;

        nivelSchema.deleteMany({ Guild: guildId,}, async (err, data) => {
            
            const embed = new EmbedBuilder()
            .setColor(client.config.prefix)
            .setDescription(`**El nivel de XP del servidor fue reseteado correctamente**`)

            await interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}