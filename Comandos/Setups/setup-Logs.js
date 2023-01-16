const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { ChannelType } = require("discord.js")
const { execute } = require("../../Events/Eventos/logs/logs");
const Schema = require('../../schemas/logs/logSchema');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("setup-logs")
  .setDescription("Configura el canal de log")
  .addChannelOption(option => 
    option.setName('canal')
    .setDescription('¿En qué canal quieres los mensajes de sanciones?')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)
),

  async execute(interaction, client){
    const {options} = interaction;
 
  if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: "¡No tienes permisos para esto!", ephemeral: true })

  if(!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: '¡No tengo permisos para esto!', ephemeral: true })

    try {
      const canal = options.getChannel("canal")
  
      if(canal.type !== "GUILD_TEXT") return interaction.reply({ content: "El canal debe ser estrictamente de texto.", ephemeral: true })
     
  Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
       if(data) {
         data.Channel = canal.id,
         data.save();
       } else {
         new Schema({
           Guild: interaction.guild.id,
           Channel: canal.id,
         }).save();
       }
      interaction.reply({ content: `Canal configurado con exito en ${canal}`, ephemeral: true });
     });
   }catch (e){
      console.log(e)
    }
}
}