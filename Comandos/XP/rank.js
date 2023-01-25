const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const nivelStatusSchema = require('../../schemas/nivel/nivelStatus');
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`rank`)
    .setDescription(`Rango de un usuario del servidor`)
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario del rango")
        .setRequired(false)
    ),
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const Member = options.getMember(`usuario`) || user;

        const member = guild.members.cache.get(Member.id);

        const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

        const Data = await nivelSchema.findOne({ Guild: guild.id, User: member.id});

        const embed = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setDescription(`**${member} todavia no tiene XP**`)

        const embed3 = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setDescription(`**El sistema de niveles esta desactivado en este servidor**`)

        if(!Data) return await interaction.reply({ embeds: [embed] });

        if(!nivelstatus.status) return await interaction.reply({ embeds: [embed3], ephemeral: true });

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 20 + 20;

        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forseStatic: true}))
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Level, "Nivel")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)

        const Card = await rank.build();

        const attachment = new AttachmentBuilder(Card, {name: "rank.png"});

        const embed2 = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setTitle(`Nivel de ${member.user.username}`)
        .setImage("attachment://rank.png")

        await interaction.editReply({ embeds: [embed2], files: [attachment]})
    }
}