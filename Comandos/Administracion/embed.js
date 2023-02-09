const { disable } = require("colors");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embedcreator")
    .setDescription("Crea un embed")
    .addStringOption(option => option.setName("titulo").setDescription("Titulo del embed").setRequired(true))
    .addStringOption(option => option.setName("descripcion").setDescription("Descripcion del embed").setRequired(true))
    .addStringOption(option => option.setName("color").setDescription("Usa un codigo hex de 6 digitos").setRequired(true).setMaxLength(6))
    .addStringOption(option => option.setName("imagen").setDescription("Imagen en el embed").setRequired(false))
    .addStringOption(option => option.setName("thumbnail").setDescription("Thumbnail para el embed").setRequired(false))
    .addStringOption(option => option.setName("nombre").setDescription("Nombre del field").setRequired(false))
    .addStringOption(option => option.setName("value").setDescription("value del vield").setRequired(false))
    .addStringOption(option => option.setName("footer").setDescription("footer del embed").setRequired(false)),

    async execute(interaction, client) {
        const { options } = interaction;

        const titulo = options.getString("titulo");
        const descripcion = options.getString("descripcion");
        const color = options.getString("color");
        const imagen = options.getString("imagen");
        const thumbnail = options.getString("thumbnail");
        const nombre = options.getString("nombre");
        const value = options.getString("value");
        const footer = options.getString("footer");

        const errembed = new EmbedBuilder()
        .setTitle(`✉ | Creador de Embed's`)
        .setDescription(`No puedes poner esta imagen`)
        .setColor(client.config.prefix)

        const errembed2 = new EmbedBuilder()
        .setTitle(`✉ | Creador de Embed's`)
        .setDescription(`No puedes poner este thumbnail`)
        .setColor(client.config.prefix)

        if (imagen) {
            if (!imagen.startsWith("http")) return await interaction.reply({ embeds: [errembed], ephemeral: true })
        }

        if (thumbnail) {
            if (!thumbnail.startsWith("http")) return await interaction.reply({ embeds: [errembed2], ephemeral: true })
        }

        const embed = new EmbedBuilder()
        .setTitle(titulo)
        .setDescription(descripcion)
        .setColor(`0x${color}`)
        .setImage(imagen)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields({ name: `${nombre || " "}`, value: `${value || " "}` })
        .setFooter({ text: `${footer || " "}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true })})

        const embed2 = new EmbedBuilder()
        .setTitle(`✉ | Creador de Embed's`)
        .setDescription(`Tu embed creado con exito`)
        .setColor(client.config.prefix)

        await interaction.reply({ embeds: [embed2], ephemeral: true });

        await interaction.channel.send({ embeds: [embed] });
    }
}