const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Avatar de un usuario")
    .addUserOption(option =>
        option.setName("usuario")
        .setDescription("Sugerencia para el servidor.")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { options } = interaction;
        const usuario = interaction.options.getUser("usuario");
        const icon = usuario.displayAvatarURL({ dynamic: true, size: 512 });
        const tag = usuario.tag;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${tag}`, iconURL: `${icon}`})
            .setTitle(`Avatar`)
            .setImage(icon)
            .setFooter({ text: `Solicitado por: ${interaction.user.tag}`})
            .setColor(client.config.prefix)
        interaction.reply({embeds: [embed]});
    }
}