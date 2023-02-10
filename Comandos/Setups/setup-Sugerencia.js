const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const suggestionSetup = require('../../schemas/sugerencia/sugerenciaSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-sugerencias')
    .setDescription('Configura las sugerencias en el servidor!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('canal')
        .setDescription('¿En qué canal quieres las sugerencias?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.color)

        const sugerenciaCanal = options.getChannel('canal')

        suggestionSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las sugerencias!`)], ephemeral: true})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: sugerenciaCanal.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las sugerencias!`)], ephemeral: true})

                await suggestionSetup.findOneAndDelete({GuildId: interaction.guild.id, data})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: sugerenciaCanal.id
                })
            }
        })
    }
}