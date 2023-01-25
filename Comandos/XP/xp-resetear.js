const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const nivelStatusSchema = require('../../schemas/nivel/nivelStatus');
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-resetear`)
    .setDescription(`Resetea el XP del servidor`)
    .setDefaultMemberPermissions(PermissionsBitField.Administrator),
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

        const { guildId } = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setDescription(`**El sistema de niveles esta desactivado en este servidor**`)

        if(!nivelstatus.status) return await interaction.reply({ embeds: [embed], ephemeral: true });

        nivelSchema.deleteMany({ Guild: guildId,}, async (err, data) => {
            
            const embed = new EmbedBuilder()
            .setColor(client.config.prefix)
            .setDescription(`**El nivel de XP del servidor fue reseteado correctamente**`)

            await interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}