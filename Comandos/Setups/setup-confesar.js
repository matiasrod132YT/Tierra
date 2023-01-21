const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const confesionSchema = require('../../schemas/confesion/confesionSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-confesiones')
    .setDescription('Configura las confesiones en el servidor!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('canal')
        .setDescription('¿En qué canal quieres las confesiones?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)

        const confesionCanal = options.getChannel('canal')

        confesionSchema.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las confesiones!`)], ephemeral: true})

                confesionSchema.create({
                    GuildId: interaction.guild.id,
                    ChannelId: confesionCanal.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las confesiones!`)], ephemeral: true})

                await reviewSchema.findOneAndDelete({GuildId: interaction.guild.id, data})

                confesionSchema.create({
                    GuildId: interaction.guild.id,
                    ChannelId: confesionCanal.id
                })
            }
        })
    }
}