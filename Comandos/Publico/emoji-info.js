const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`emoji-info`)
    .setDescription(`Gets Emoji Info`)
    .addStringOption((option) =>
      option
        .setName(`emoji`)
        .setDescription(`The Emoji`)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;

    const emoji = options.getString(`emoji`);

    if (!emoji.startsWith(`<`))
      return interaction.reply({
        content: `Proporcione un emoji personalizado!`,
        ephemeral: true,
    });

    const emojiid = emoji.split(`:`)[2].slice(0, -1);

    const emojiurl = `https://cdn.discordapp.com/emojis/${emojiid}.png`;

    const boton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji(`🔗`)
            .setLabel('Descargar')
            .setURL(emojiurl)
            .setStyle(ButtonStyle.Link)
        )
	
    const embed = new EmbedBuilder()
    .setTitle(`Informacion del Emoji`)
    .setDescription(`**Nombre:** \`${emoji}\`\n**ID:** \`${emojiid}\``)
    .setThumbnail(emojiurl)
    .setColor(client.config.color)

    interaction.reply({ embeds: [embed], components: [boton]})
  },
};