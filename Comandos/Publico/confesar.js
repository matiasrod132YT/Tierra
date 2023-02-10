const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder } = require(`discord.js`);
const confesionSchema = require("../../schemas/confesion/confesionSchema")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("confesar")
  .setDescription("Envia una concecion (No se muestra nombre)")
  .addStringOption((option) =>
    option
      .setName("concecion")
      .setDescription("Tu concecion")
      .setRequired(true)
),

  async execute (interaction, client) {
    const { options } = interaction;

    const concecion = options.getString("concecion")
    
    const embed = new EmbedBuilder()
    .setTitle(`🧾 | Confesion`)
    .addFields(
      {name: `Confecion`, value: ` \`\`\`${concecion}\`\`\` `},
    )
    .setTimestamp()
    .setFooter({
      text: "/confesar para mandar una confesion"
    })
    .setColor(client.config.color)

    const errembed = new EmbedBuilder()
    .setTitle(`🧾 | Confesion`)
    .setDescription("**¡La confesion no esta configurada en el servidor!**")
    .setColor(client.config.color)

    confesionSchema.findOne({GuildId: interaction.guild.id}, async (err, data) => {
        const canal = interaction.guild.channels.cache.get(data.ChannelId);
        const embed2 = new EmbedBuilder()
        .setTitle(`🧾 | Confesion`)
        .setDescription(`Se a enviado con exito tu confesion en ${canal}`)
        .setColor(client.config.color)
        
        if (err) throw err;
    
          if (!data) {
            return interaction.reply({embeds: [errembed], ephemeral: true})
          }
    
          if (data) {
              try {
                const m = await canal.send({embeds: [embed]});
                await interaction.reply({embeds: [embed2], ephemeral: true});
    
              } catch (err) {
                  console.log(err)
              }
          }
    })
  }
}