const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
  } = require("discord.js");
  
  const translate = require("translate-google");
  const ISO6391 = require("iso-639-1");
  
  module.exports = {
    data: new SlashCommandBuilder()
    .setName("traductor")
    .setDescription("Traduce un texto")
    .addStringOption((option) =>
      option
        .setName("texto")
        .setDescription("¿Que quieres traducir?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("idioma")
        .setDescription("¿A que idioma lo quieres traducir? (Ejemplo: es, en, ru)")
        .setRequired(true)
    ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const texto = interaction.options.getString("texto");
      const idioma = interaction.options.getString("idioma");
      translate(texto, { to: idioma })
        .then((resultado) => {
            const idiomaNombre = ISO6391.getName(idioma) || idioma;
            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle(`Traducido a ${idiomaNombre}`)
            .addFields(
                {
                name: `Tu texto:`,
                value: `${texto}`,
                },
                {
                name: `Texto traducido:`,
                value: `${resultado}`,
                }
            )
            .setFooter({
                text: `Lista de Idiomas:\nhttps://cloud.google.com/translate/docs/languages`,
                iconURL:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png",
            });
            interaction.reply({ embeds: [embed] });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };