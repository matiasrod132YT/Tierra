const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRow, ActionRowBuilder } = require("discord.js")
const reporteSchema = require("../../schemas/Reporte/reporteSchema")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reportar")
    .setDescription("Reporta a un usuario"),

    async execute(interaction, client) {
         
        reporteSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            
            if (!data) {
                const errembed = new EmbedBuilder()
                .setTitle(`⚒ | Sistema de Reportes`)
                .setDescription(`El sistema de reportes no esta habilitado en este servidor`)
                .setColor(client.config.prefix)

                return await interaction.reply({ embeds: [errembed], ephemeral: true })
            }
            
            if (data) {
                const modal = new ModalBuilder()
                .setTitle("Formulario de Reporte")
                .setCustomId(`modal`)

                const contacto = new TextInputBuilder()
                .setCustomId(`contacto`)
                .setRequired(true)
                .setLabel(`Provide us with a form of contact`)
                .setPlaceholder("discord is usually best")
                .setStyle(TextInputStyle.Short)

                const reporte = new TextInputBuilder()
                .setCustomId(`reporte`)
                .setRequired(true)
                .setLabel(`¿Que quieres reportar?`)
                .setPlaceholder("¿Un usuario, queja del server o algo mas?")
                .setStyle(TextInputStyle.Short)

                const descripcion = new TextInputBuilder()
                .setCustomId(`descripcion`)
                .setRequired(true)
                .setLabel(`Describe tu reporte`)
                .setPlaceholder("Se lo mas detallado posible")
                .setStyle(TextInputStyle.Paragraph)

                const contactoActionRow = new ActionRowBuilder().addComponents(contacto)
                const reporteActionRow = new ActionRowBuilder().addComponents(reporte)
                const descripcionActionRow = new ActionRowBuilder().addComponents(descripcion)

                modal.addComponents(contactoActionRow, reporteActionRow, descripcionActionRow)

                interaction.showModal(modal)
            }
        })

    }
}