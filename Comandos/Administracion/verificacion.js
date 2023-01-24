const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const verificacionSchema = require('../../schemas/verificacion/verificacionSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verificacion')
    .setDescription("Verificacion")
    .addRoleOption(option =>
        option.setName(`rol`)
        .setDescription(`Rol para la verificacion`)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
      try{
        const { options } = interaction;

        const rol = options.getRole("rol");

        let data = await verificacionSchema.findOne({ guildId: interaction.guild.id })
        if(!data) {
            let newdata = new verificacionSchema({
                rol: rol.id,
                guildId: interaction.guild.id,
            })
            return await newdata.save() 
        };
        await verificacionSchema.findOneAndUpdate({
            rol: rol.id,
            guildId: interaction.guild.id,
        })
        
        const boton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`verificacion`)
            .setEmoji(`✅`)
            .setLabel(`Verificar`)
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle(`🔒 | Verificacion`)
        .setDescription(`¡Bienvenido ${interaction.user.name} al servidor! Haz click al boton "Verificar" para verificarte en el servidor.`)
        .setColor(client.config.prefix)
        
        const embed2 = new EmbedBuilder()
        .setTitle(`🔒 | Verificacion`)
        .setDescription(`Se a creado con exito la verificacion`)
        .setColor(client.config.prefix)

        const embed3 = new EmbedBuilder()
        .setTitle(`🔒 | Verificacion`)
        .setDescription(`Haz sido verificado en el servidor **${interaction.guild.name}** con el rol de **${rol.name}**`)
        .setColor(client.config.prefix)

        interaction.channel.send({ embeds: [embed], components: [boton] });
        await interaction.user.send({ embeds: [embed3] }).catch(err => {return});

        interaction.reply({ embeds: [embed2], ephemeral: true})
        setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);
    } catch(e) { console.error(e) }
    }
}