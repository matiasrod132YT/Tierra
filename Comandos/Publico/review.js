const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  MembershipScreeningFieldType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reseña")
    .setDescription("Manage roles of the server or members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) => subcommand
      .setName("bot")
      .setDescription("Manda una reseña al bot")
      .addStringOption((option) => option
        .setName("bot-estrellas")
        .setDescription("Califica")
        .setRequired(true)
        .addChoices(
          { name: "⭐", value: "⭐" },
          { name: "⭐⭐", value: "⭐⭐" },
          { name: "⭐⭐⭐", value: "⭐⭐⭐" },
          { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
          { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
        )
      )
      .addStringOption((option) => option
        .setName("descripcion")
        .setDescription("Descripcion de tu reseña")
        .setRequired(true)
      ))
    .addSubcommand((subcommand) => subcommand
      .setName("server")
      .setDescription("Manda una reseña")
      .addStringOption((option) => option
        .setName("estrellas")
        .setDescription("Califica")
        .setRequired(true)
        .addChoices(
          { name: "⭐", value: "⭐" },
          { name: "⭐⭐", value: "⭐⭐" },
          { name: "⭐⭐⭐", value: "⭐⭐⭐" },
          { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
          { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
        )
      )
      .addStringOption((option) => option
        .setName("bot-descripcion")
        .setDescription("Descripcion de tu reseña")
        .setRequired(true)
      )),
  async execute(interaction, client) {
    const { options } = interaction;

    const estrellas = options.getString("estrellas");
    const descripcion = options.getString("descripcion");
    
    const botestrellas = options.getString("bot-estrellas");
    const botdescripcion = options.getString("bot-descripcion");

    const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .addFields([
      {
        name: "Estrellas",
        value: `${estrellas}`,
      },
      {
        name: "Reseña",
        value: `${descripcion}`,
      },
    ])
    .setColor(client.config.prefix)
    .setTimestamp()

    const embed2 = new EmbedBuilder()
    .setTitle(`⭐ | Reseña`)
    .setDescription("**Tu review fue enviada con exito.**")
    .setColor(client.config.prefix)

    const embed3 = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .addFields([
      {
        name: "Estrellas",
        value: `${botestrellas}`,
      },
      {
        name: "Reseña",
        value: `${botdescripcion}`,
      },
    ])
    .setColor(client.config.prefix)
    .setTimestamp()
    
    const errembed = new EmbedBuilder()
    .setTitle(`⭐ | Reseña`)
    .setDescription("**¡Las reseñas no están configuradas en el servidor!**")
    .setColor(client.config.prefix)

    if (interaction.options.getSubcommand() === 'server') {
      try {
        reviewSchema.findOne({GuildId: interaction.guild.id}, async (err, data) => {
          if (err) throw err;
    
          if (!data) {
            return interaction.reply({embeds: [errembed], ephemeral: true})
          }
    
          if (data) {
              const canal = interaction.guild.channels.cache.get(data.ChannelId);
      
              try {
                const m = await canal.send({embeds: [embed]});
                await interaction.reply({embeds: [embed2], ephemeral: true});
    
              } catch (err) {
                  console.log(err)
              }
          }
        })
      } catch {
        const embed2 = new EmbedBuilder()
          .setDescription(`Algo salio mal. Unase al servidor de soporte para informar del error`)
          .setColor(client.config.prefix)
        return interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    }

    if (interaction.options.getSubcommand() === 'bot') {
      try {
        const canal = ("1063249310856269935")

        const m = await canal.send({embeds: [embed3]});
        await interaction.reply({embeds: [embed2], ephemeral: true});
      } catch {
        const embed2 = new EmbedBuilder()
          .setDescription(`Algo salio mal. Unase al servidor de soporte para informar del error`)
          .setColor(client.config.prefix)
        return interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    }
  }
}