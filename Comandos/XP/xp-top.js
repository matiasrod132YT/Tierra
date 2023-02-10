const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const nivelStatusSchema = require('../../schemas/nivel/nivelStatus');
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-top`)
    .setDescription(`Top's XP`),
    async execute(interaction, client) {
        const { guild } = interaction;

        const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

        let text = "";
        
        const embed1 = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`**Todavia nadie esta en el TOP XP**`)

        const embed2 = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`**El sistema de niveles esta desactivado en este servidor**`)

        const Data = await nivelSchema.find({ Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(10)
            
        if (!Data) return await interaction.reply({ embeds: [embed1] });

        if(!nivelstatus.status) return await interaction.reply({ embeds: [embed2], ephemeral: true });

        await interaction.deferReply();

        for (let counter = 0; counter < Data. length; ++counter) {
            let { User, XP, Level } = Data[counter];

            const value = await client.users.fetch(User) || "Usuario desconocido"
            
            const member = value.tag;

            text += `${counter + 1}. ${member} | XP: ${XP} | Nivel: ${Level} \n`

            const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle(`TOP XP de ${interaction.guild.name}`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "TOP XP"})

            interaction.editReply({ embeds: [embed]})
        }
    }
}