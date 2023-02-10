const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const nivelStatusSchema = require('../../schemas/nivel/nivelStatus');
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-reset`)
    .setDescription(`Resetea el XP de un usuario`)
    .setDefaultMemberPermissions(PermissionsBitField.Administrator)
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario que quieras eliminar la XP")
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const { guildId } = interaction;

        const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

        const target = interaction.options.getUser(`usuario`);

        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`**El sistema de niveles esta desactivado en este servidor**`)

        if(!nivelstatus.status) return await interaction.reply({ embeds: [embed], ephemeral: true });

        nivelSchema.deleteMany({ Guild: guildId, User: target.id}, async (err, data) => {
            
            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(`**El nivel de XP de ${target.tag} fue reseteado correctamente**`)

            await interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}