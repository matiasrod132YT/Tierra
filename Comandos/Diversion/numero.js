const {
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType,
  } = require("discord.js");
  const guessthenumber = require("../../schemas/adivina-numero/adivinaNumeroSchema");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("numero")
      .setDescription("Crea un evento de Adivina el Numero")
      .addChannelOption((options) =>
        options
          .setName("canal")
          .setDescription("canal para iniciar el evento")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addIntegerOption((options) =>
        options
          .setName("numero")
          .setDescription("Numero que deben adivinar")
          .setRequired(true)
      ),
  
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const { options, guild, user } = interaction;
  
      const canal = options.getChannel("canal");
      const numero = options.getInteger("numero");
  
      const data = await guessthenumber
        .findOne({ Guild: guild.id })
        .catch((err) => {});
      if (!data) {
        await guessthenumber
          .create({ Guild: guild.id, Channel: canal.id, number: numero })
          .catch((err) => {});
      }
  
      await interaction.reply({
        content: `Se a creado con exito el evento Adivina el Numero, Canal: ${canal} | Numero: \`${numero}\`.`,
        ephemeral: true,
      });
      const embed2 = new EmbedBuilder()
      .setTitle(`Adivina el Numero`)
      .setDescription(`Se a creado un evento de Adivina el Numero, Adivina el numero!!!`)
      .setColor(client.config.prefix)
      await canal.send({ embeds: [embed2] })
    },
  };