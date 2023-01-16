const { MessageEmbed, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, EmbedBuilder, MessageSelectMenu, MessageAttachment } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("nitro")
    .setDescription("Informacion del servidor"),
/**
 * @param {ChatInputCommandInteraction} interaction
 */
    async execute(interaction, client) {
        const nitro = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setTitle("¡Te han regalado una suscripción!")
        .setThumbnail("https://static.roundme.com/upload/user/d30750eda6c30bba9295ad629961420555c05496.png")
        .setDescription(`Te han regalado Nitro por **¡1 mes!**\nExpira en **48 horas**`)
        .setFooter({ text: "convertido por TIERRA#0001", iconURL: "https://images-ext-2.discordapp.net/external/cRLNR3dzlHu8ufNcLHlseIiLr1y71NCKJDfkcytBCSI/%3Fsize%3D512/https/cdn.discordapp.com/avatars/1055739238710251520/f5bad05d75b5c1d25d9bf5bb2ba81b39.webp"});

        const row = new ButtonBuilder()
            .setCustomId("click")
            .setLabel("reclamar")
            .setStyle(3);

        const a = new ActionRowBuilder().addComponents(row);
        const msg = await interaction.reply({ embeds: [nitro], components: [a] });
        const collector = msg.createMessageComponentCollector((button) => button.user.id === message.author.id, {time: 60e3});
        
        collector.on('collect', async (b) => {
            if (b.customId === "click") {
            interaction.editReply({ content: "https://imgur.com/NQinKJB", embeds: [], components: [] });
            }
        })
    }
}