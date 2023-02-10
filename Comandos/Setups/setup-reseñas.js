const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const reviewSchema = require('../../schemas/Review/reviewSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-reseñas')
    .setDescription('Configura las reseñas en el servidor!')
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

        const reviewCanal = options.getChannel('canal')

        reviewSchema.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las reseñas!`)], ephemeral: true})

                reviewSchema.create({
                    GuildId: interaction.guild.id,
                    ChannelId: reviewCanal.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`¡Se a configurado con exito las reseñas!`)], ephemeral: true})

                await reviewSchema.findOneAndDelete({GuildId: interaction.guild.id, data})

                reviewSchema.create({
                    GuildId: interaction.guild.id,
                    ChannelId: reviewCanal.id
                })
            }
        })
    }
}