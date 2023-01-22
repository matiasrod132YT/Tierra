const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia-pagar`)
    .setDescription(`Paga a alguien dinero`)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona un usuario")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("pagar")
        .setDescription("¿Cuanto dinero quieres pagarle?")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { user, options, guild } = interaction;

        const Member = options.getUser("usuario")
        const pagar = options.getNumber("pagar")
        const sender = user;

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`El usuario no tiene una cuenta`)
        .setColor(client.config.prefix)

        const embed2 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Porfavor, Crea una cuenta primero`)
        .setColor(client.config.prefix)

        const embed4 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No puedes mandarte dinero a ti mismo`)
        .setColor(client.config.prefix)

        const embed5 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Le has pagado $${pagar} a ${Member}`)
        .setColor(client.config.prefix)

        let data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })
        if (!data) return interaction.reply({ embeds: [embed2], ephemeral: true })

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: Member.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true })

        const Sender = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id
        })

        const embed3 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No tienes esa cantidad de dinero. \n\n**Banco:** ${Sender.Bank}\n**Cantidad a pagar:** ${pagar}`)
        .setColor(client.config.prefix)

        const dinerorecivido = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })

        if (Sender.Bank < pagar) {
            return interaction.reply({ embeds: [embed3], ephemeral: true })
        }

        if (sender === Member) {
            return interaction.reply({ embeds: [embed4], ephemeral: true })
        }

        const datosenviados = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id
        })
        datosenviados.Bank -= pagar
        datosenviados.save()

        const datosrecividos = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })
        datosrecividos.Bank += pagar
        datosrecividos.save()

        interaction.reply({ embeds: [embed5], ephemeral: true})

    }
}