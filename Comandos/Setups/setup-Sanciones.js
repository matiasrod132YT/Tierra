const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const sancionesSetup = require('../../schemas/sanciones/sancionesSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-sanciones')
    .setDescription('Configura las sanciones del servidor!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('canal')
        .setDescription('¿En qué canal quieres los mensajes de sanciones?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.color)

        const sancionesCanal = options.getChannel('canal')

        let data = await sancionesSetup.findOne({ GuildId: interaction.guild.id})
            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las sanciones!`)], ephemeral: true})

                await sancionesSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: sancionesCanal.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las sanciones!`)], ephemeral: true})

                await sancionesSetup.findOneAndDelete({GuildId: interaction.guild.id, data})

                await sancionesSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: sancionesCanal.id
                })
            }
        }
    }