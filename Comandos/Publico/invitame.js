const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("invitame")
      .setDescription("Invita a Tierra a tu servidor"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
      const link = `https://discord.com/api/oauth2/authorize?client_id=1053062638369787944&permissions=8&scope=bot`;
      const boton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setURL(link)
        .setLabel("INVITAME")
        .setStyle(ButtonStyle.Link)
    );
      const embed = new EmbedBuilder()
        .setTitle(`INVITAME`)
        .setDescription(`Añade a Tierra a tu servidor\n\n \`Dale click al boton para invitarme a tu servidor\``)
        .setFooter({ text:`Solicitado por: ${interaction.user.tag}`})
        .setColor(client.config.prefix)
  
      interaction.reply({ embeds: [embed], components: [boton] });
    },
  };