const {
    SlashCommandBuilder,
    Client,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
  } = require("discord.js");
  const antilinkSchema = require("../../schemas/AntiLink/AntiLink");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("antilink")
      .setDescription("Sistema AntiLink")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const guild = interaction.guild;
  
      await interaction.deferReply();
  
      let requireDB = await antilinkSchema.findOne({ _id: guild.id });
  
      const sistema = requireDB?.logs === true ? "📗 Activado" : "📕 Desabilitado";
  
      const e2 = new EmbedBuilder()
        .setTitle(`🔗 AntiLink`)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(client.config.color)
        .setImage("https://share.creavite.co/QaATY9cbqa9ggxSy.gif")
        .setDescription(
          `AntiLink de **${guild.name}**\n\nEl sistema esta \`${sistema}\`.\n\n¡Usa los botones de abajo para configurar el AntiLink del servidor!`
        )
        .setFooter({
          text: guild.name,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(new Date());
  
      const b = new ButtonBuilder()
        .setLabel(`Activar`)
        .setCustomId(`true`)
        .setStyle(3)
        .setEmoji(`📗`);
  
      const b1 = new ButtonBuilder()
        .setLabel(`Desactivar`)
        .setCustomId(`false`)
        .setStyle(4)
        .setEmoji(`📕`);
  
      const ac = new ActionRowBuilder().addComponents(b, b1);
  
      const tf = await interaction.editReply({ embeds: [e2], components: [ac] });
  
      const coll = tf.createMessageComponentCollector();
  
      coll.on("collect", async (ds) => {
        if (ds.user.id !== interaction.user.id) return;
  
        if (ds.customId === `true`) {
          const e = new EmbedBuilder()
          .setDescription(`📗 El Sistema de AntiLink esta **Activado**`)
          .setColor(client.config.color)
  
          ds.update({ embeds: [e], components: [] });
  
          await antilinkSchema.findOneAndUpdate(
            { _id: guild.id },
            {
              $set: { logs: true },
            },
            { upsert: true }
          );
        } else if (ds.customId === `false`) {
          const e = new EmbedBuilder()
          .setDescription(`📕 El Sistema de AntiLink esta **Desactivado**`)
          .setColor(client.config.color)
  
          ds.update({ embeds: [e], components: [] });
  
          await antilinkSchema.findOneAndUpdate(
            { _id: guild.id },
            {
              $set: { logs: false },
            },
            { upsert: true }
          );
        }
      });
    },
  };