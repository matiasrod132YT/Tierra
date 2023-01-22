const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia-añadir`)
    .setDescription(`Añade dinero a alguien`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona un usuario")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("añadir")
        .setDescription("¿Cuanto dinero quieres añadirle?")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { user, options, guild } = interaction;

        const Member = options.getUser("usuario")
        const añadir = options.getNumber("añadir")

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`El usuario no tiene una cuenta`)
        .setColor(client.config.prefix)

        const embed2 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Se añadio con exito $${añadir} a ${Member}`)
        .setColor(client.config.prefix)

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: Member.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true })

        const dinerorecivido = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })

        const datosrecividos = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })
        datosrecividos.Bank += añadir
        datosrecividos.save()

        interaction.reply({ embeds: [embed2], ephemeral: true })
    }
}