const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const warningSchema = require("../../schemas/warn/warnSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("advertencias")
    .setDescription("Advertencias de un usuario")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option.setName("usuario")
            .setDescription("Usuario a ver advertencias")
            .setRequired(true)
    ),
    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const usuario = options.getUser("usuario");

        const embed = new EmbedBuilder()
        const noadvertencias = new EmbedBuilder()

        warningSchema.findOne({ GuildID: guildId, UserID: usuario.id, UserTag: usuario.tag }, async (err, data) => {
            
            if (err) throw err;

            if (data) {
                embed.setColor(client.config.color)
                .setTitle(`⚠️ | Advertencias de ${usuario.tag}`)
                .setDescription(`${data.Content.map(
                    (w, i) => 
                        `
                            **→ Advertencia**: ${i + 1}
                            **Por:** ${w.ExecuterTag}
                            **→ Razón**: ${w.Reason}
                        `
                ).join(`-`)}`)

                interaction.reply({ embeds: [embed] });
            } else {
                noadvertencias.setColor(client.config.color)
                .setDescription(`**⚠️ | ${usuario.tag} tiene \`0\` advertencias!**`)

                interaction.reply({ embeds: [noadvertencias] })
            }
        });
    }
}