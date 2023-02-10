const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia-quitar`)
    .setDescription(`Quita dinero a alguien`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona un usuario")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("quitar")
        .setDescription("¿Cuanto dinero quieres quitarle?")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { user, options, guild } = interaction;

        const Member = options.getUser("usuario")
        const quitar = options.getNumber("quitar")

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`El usuario no tiene una cuenta`)
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Se a quitado con exito $${quitar} de la cuenta de ${Member}`)
        .setColor(client.config.color)

        const embed3 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`El usuario no tiene esa cantidad de dinero`)
        .setColor(client.config.color)

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: Member.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true })

        const dinerorecivido = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })

        if (dinerorecivido.Bank < quitar) return interaction.reply({ embeds: [embed3], ephemeral: true})

        const datosrecividos = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })
        datosrecividos.Bank -= quitar
        datosrecividos.save()

        interaction.reply({ embeds: [embed2], ephemeral: true })
    }
}