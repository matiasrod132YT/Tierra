const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const nivelSchema = require(`../../schemas/nivel/nivel`);
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-top`)
    .setDescription(`Top's XP`),
    async execute(interaction, client) {
        const { guild } = interaction;

        let text = "";
        
        const embed1 = new EmbedBuilder()
        .setColor(client.config.prefix)
        .setDescription(`**Todavia nadie esta en el TOP XP**`)

        const Data = await nivelSchema.find({ Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(10)
            
        if (!Data) return await interaction.reply({ embeds: [embed1] });

        await interaction.deferReply();

        for (let counter = 0; counter < Data. length; ++counter) {
            let { User, XP, Level } = Data[counter];

            const value = await client.users.fetch(User) || "Usuario desconocido"
            
            const member = value.tag;

            text += `${counter + 1}. ${member} | XP: ${XP} | Nivel: ${Level} \n`

            const embed = new EmbedBuilder()
            .setColor(client.config.prefix)
            .setTitle(`TOP XP de ${interaction.guild.name}`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "TOP XP"})

            interaction.editReply({ embeds: [embed]})
        }
    }
}