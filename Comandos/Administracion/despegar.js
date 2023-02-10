const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const pegajosoSchema = require("../../schemas/pegajoso/pegajosoSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`despegar`)
    .setDescription("Elimina un mensaje pegajoso en el siguiente canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    

    async execute(interaction, client) {
        const { options } = interaction;

        const data = await pegajosoSchema.findOne({ CanalID: interaction.channel.id });

        const embed = new EmbedBuilder()
        .setTitle(`📧 | Mensaje Pegajoso`)
        .setDescription(`No hay un mensaje pegajoso en este canal`)
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setTitle(`📧 | Mensaje Pegajoso`)
        .setDescription(`El mensaje pegajoso fue eliminado con exito`)
        .setColor(client.config.color)

        if (!data) {
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            try {
                interaction.client.channels.cache.get(data.CanalID).messages.fetch(data.ultimoMensajeId).then(async(m) => {
                    await m.delete();
                })
            } catch {
                return;
            }
        }

        pegajosoSchema.deleteMany({ CanalID: interaction.channel.id}, async (err, data) => {
            if (err) throw err;

            return await interaction.reply({ embeds: [embed2]})
        })
    }
}