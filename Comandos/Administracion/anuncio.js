const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const anuncioSchema = require("../../schemas/anuncio/anuncioSchema");
const anuncioSetup = require("../../schemas/anuncio/anuncioSetup");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription("📢 Sistema de anuncios")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName("descripcion")
            .setDescription("Descripcion del anuncio")
            .setRequired(true)
    ),
    
    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const descripcion = options.getString("descripcion")
        const tag = interaction.user.tag;

        const embed = new EmbedBuilder()
        .setTitle(`📢 | ANUNCIO | ${interaction.guild.name}`)
        .setDescription(descripcion)
        .setTimestamp()
        .setFooter({ text: `${interaction.guild.name}© - Todos los derechos reservados` })
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setTitle(`📢 | El Anuncio se envio correctamente`)
        .setColor(client.config.color)

        const errEmbed = new EmbedBuilder()
        .setDescription("**📢 | Los Anuncios no están configuradas en el servidor!**")
        .setColor(client.config.color)

        anuncioSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {

                if (!data.MencionId) {
                    const anuncioCanal = interaction.guild.channels.cache.get(data.ChannelId);

                    try {
                        const mencion = interaction.guild.roles.cache.get(data.MencionId);
                        const m = await anuncioCanal.send({ embeds: [embed], fetchReply: true});
                        
                        await interaction.reply({embeds: [embed2], ephemeral: true});
                        setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);
    
                        anuncioSchema.create({
                            GuildId: guildId,
                            MessageId: m.id,
                            MencionId: mencion
                        });
                    } catch (err) {
                        console.log(err)
                    }
                }

                if (data.MencionId) {
                    const anuncioCanal = interaction.guild.channels.cache.get(data.ChannelId);
                    const mencion = interaction.guild.roles.cache.get(data.MencionId);

                    try {
                        const m = await anuncioCanal.send({ embeds: [embed], content: `||${data.MencionId}||` , fetchReply: true});
                        
                        await interaction.reply({embeds: [embed2], ephemeral: true});
                        setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000);
    
                        anuncioSchema.create({
                            GuildId: guildId,
                            MessageId: m.id,
                            MencionId: mencion
                        });
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        })
    },
};