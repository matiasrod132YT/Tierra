const { EmbedBuilder } = require("discord.js");
const reporteSchema = require("../../../schemas/Reporte/reporteSchema");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === `modal`) {
            const contacto = interaction.fields.getTextInputValue(`contacto`)
            const reporte = interaction.fields.getTextInputValue(`reporte`)
            const descripcion = interaction.fields.getTextInputValue(`descripcion`)

            const miembro = interaction.user.id;
            const tag = interaction.user.tag;
            const server = interaction.guild.name;

            const embed = new EmbedBuilder()
            .setTitle(`Nuevo Reporte`)
            .addFields({ name: "Formulario de contacto", value: `${contacto}`, inline: false })
            .addFields({ name: "Reporte", value: `${reporte}`, inline: false })
            .addFields({ name: "Descripcion", value: `${descripcion}`, inline: false })
            .setColor(client.config.prefix)

            const embed2 = new EmbedBuilder()
            .setTitle(`⚒ | Sistema de Reportes`)
            .setDescription(`Tu reporte fue enviado con exito`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`})
            .setTimestamp()
            .setColor(client.config.prefix)

            reporteSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {
                
                if (!data) return;

                if (data) {
                    const canalID = data.Channel;

                    const canal = interaction.guild.channels.cache.get(canalID);

                    canal.send({ embeds: [embed] });

                    await interaction.user.send({ embeds: [embed2], ephemeral: true })
                }
            })
        }
  }
}