const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const { Types } = require("mongoose");
  
  const verificacionSchema = require("../../../schemas/verificacion/verificacionSchema");
  
  module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
     try {
        let data = await verificacionSchema.findOne({ guildId: interaction.guild.id })
        if(!data) return;

        let rol = interaction.guild.roles.cache.find (rol => rol.id == data.rol)

        const embed = new EmbedBuilder()
        .setTitle(`🔒 | Verificacion`)
        .setDescription(`¡Bienvenido ${interaction.user.name} al servidor! Haz click al boton "Verificar" para verificarte en el servidor.`)
        .setColor("#FF3939")

        const boton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`verificacion`)
            .setEmoji(`✅`)
            .setLabel(`Verificar`)
            .setStyle(ButtonStyle.Success),
        )

        const embed2 = new EmbedBuilder()
        .setTitle(`🔒 | Verificacion`)
        .setDescription(`Haz sido verificado en el servidor **${interaction.guild.name}** con el rol de **${rol.name}**`)
        .setColor("#FF3939")

        if (interaction.isButton) {
        const { channel, member, guild, customId } = interaction;

        switch (customId) {
            case "verificacion":
                await interaction.update({ embeds: [embed], components: [boton] });
        
                const rol = data.rol
        
                const usuario = interaction.member;
        
                usuario.roles.add(rol);
        
                interaction.user.send({ embeds: [embed2] }).catch(err => {
                    return;
                })
            }
        }
    } catch(e) { console.error(e) }
    }
};