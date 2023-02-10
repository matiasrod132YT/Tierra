const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("md")
    .setDescription("Envia md a un usuario")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option.setName("usuario")
        .setDescription("Usuario que quieres enviar md")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("descripcion")
        .setDescription("Mensaje")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { options } = interaction;

        const usuario = interaction.options.getUser("usuario");
        const descripcion = interaction.options.getString("descripcion");

        const embed = new EmbedBuilder()
        .setTitle(`MD`)
        .setDescription(`${descripcion}`)
        .setFooter({ text: `Enviado por: ${interaction.user.tag}`})
        .setColor(client.config.color)

        await usuario.send({ embeds: [embed] })
    }
}