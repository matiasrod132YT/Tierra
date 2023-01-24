const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`robar`)
    .setDescription(`Trabaja para ganar dinero`)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona un usuario")
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const usuario = options.getUser("usuario")

        const embed = new EmbedBuilder()
        .setTitle(`🔫 | Robar`)
        .setDescription(`El usuario no tiene billetera ni cuenta`)
        .setColor(client.config.prefix)

        const embed3 = new EmbedBuilder()
        .setTitle(`🔫 | Robar`)
        .setDescription(`${usuario} No tiene nada interesante que robar`)
        .setColor(client.config.prefix)

        const embed4 = new EmbedBuilder()
        .setTitle(`🔫 | Robar`)
        .setDescription(`No puedes robarte a ti mismo`)
        .setColor(client.config.prefix)

        let data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: usuario.id }).catch(err => { })
        if (!data) return interaction.reply({ embeds: [embed2], ephemeral: true })

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true })

        if (usuario === interaction.user) {
            return interaction.reply({ embeds: [embed4], ephemeral: true })
        }

        if (Data.Wallet = undefined || Data.Wallet == 0 || Data.Wallet < 0) {
            return interaction.reply({ embeds: [embed3]}),
            setTimeout(function(){interaction.deleteReply({ embeds: [embed3] })}, 5000)
        }

        const datosrecividos = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: interaction.user.id
        })

        const datosenviados = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: usuario.id
        })

        const embed5 = new EmbedBuilder()
        .setTitle(`🔫 | Robar`)
        .setDescription(`Haz robado $${datosenviados.Wallet} a ${usuario}`)
        .setColor(client.config.prefix)
        
        datosrecividos.Wallet += datosenviados.Wallet
        datosrecividos.save()

        datosenviados.Wallet -= datosenviados.Wallet
        datosenviados.save()

        interaction.reply({ embeds: [embed5], ephemeral: true})

    }
}