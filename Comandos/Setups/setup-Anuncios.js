const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const anunciosSetup = require('../../schemas/anuncio/anuncioSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-anuncios')
    .setDescription('Configura los anuncios del servidor!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('canal')
        .setDescription('¿En qué canal quieres los anuncios?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption(option => 
        option.setName('mencion')
        .setDescription('¿Mencionar a quien?')
        .setRequired(false)
    ),

    async execute(interaction, client) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)

        const anunciosCanal = options.getChannel('canal')
        const mencion = options.getRole('mencion')

        let data = await anunciosSetup.findOne({ GuildId: interaction.guild.id})
            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`**¡Se a configurado con exito los anuncios!**`)], ephemeral: true})
                setTimeout(function(){interaction.deleteReply({ embeds: [embed] })}, 5000);

                await anunciosSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: anunciosCanal.id,
                    MencionId: mencion
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`**¡Se a configurado con exito los anuncios!**`)], ephemeral: true})
                setTimeout(function(){interaction.deleteReply({ embeds: [embed] })}, 5000);

                await anunciosSetup.findOneAndDelete({GuildId: interaction.guild.id, data})

                await anunciosSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: anunciosCanal.id,
                    MencionId: mencion
                })
            }
        }
    }