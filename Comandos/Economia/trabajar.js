const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`trabajar`)
    .setDescription(`Trabaja para ganar dinero`),
    
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Porfavor, Crea una cuenta primero`)
        .setColor(client.config.prefix)

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true }),
            setTimeout(function(){interaction.deleteReply({ embeds: [embed] })}, 5000)

        if (Data) {
            let dinerotrabajado = Math.floor(Math.random() * 160) + 90;

            const embed2 = new EmbedBuilder()
            .setDescription(`Haz trabajado y ganastes $${dinerotrabajado}`)
            .setColor(client.config.prefix)

            Data.Wallet += dinerotrabajado
            Data.save()

            return interaction.reply({ embeds: [embed2]}),
            interaction.setCooldown(5000)
            
        }
    }
}