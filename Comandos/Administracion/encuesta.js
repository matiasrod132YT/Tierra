const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("encuesta")
        .setDescription("Crea una encuesta")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("descripcion")
                .setDescription("Descripcion de la encuesta")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("canal")
                .setDescription("¿Donde quieres enviar la encuesta?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction, client) {
        const { options } = interaction;

        const channel = options.getChannel("canal");
        const description = options.getString("descripcion");

        const embed = new EmbedBuilder()
            .setTitle("ENCUESTA")
            .setDescription(description)
            .setTimestamp()
            .setColor(client.config.prefix)

        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react("✅");
            await m.react("❌");
            await interaction.reply({ content: "Encuesta fue enviada con exito.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}