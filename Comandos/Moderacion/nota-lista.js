const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} = require("discord.js");
  
const notaSchema = require("../../schemas/Notas/NotasSchema");
  
module.exports = {
data: new SlashCommandBuilder()
.setName("nota-lista")
.setDescription("Lista de notas de un usuario")
.addUserOption((option) =>
  option
    .setName("usuario")
    .setDescription("User to get the notes logs from.")
    .setRequired(true)
),

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 */
async execute(interaction, client) {
    const usuario = interaction.options.getUser("usuario");

    const noteData = await notaSchema.find({
        User: usuario.id,
        Guild: interaction.guild.id,
    });

    if (!noteData?.length)
        return interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle("š | Sistema de Notas")
            .setDescription(`${usuario} no tiene ninguna nota`)
            .setColor(client.config.color)
        ],
        });

    const embed = new EmbedBuilder()
    .setTitle(`š | Notas de ${usuario.tag}`)
    .setColor(client.config.color);

    for (const notas of noteData.slice(0, 5)) {
        const staff = interaction.guild.members.cache.get(
            notas.Staff
        );

        embed.addFields({
        name: `š ID:  ${notas._id}`,
        value: `š Nota: \`${notas.Nota}\`\nā³ Tiempo: ${notas.Tiempo}\nš§ Staff: ${staff}`,
        });
    }

    await interaction.reply({ embeds: [embed] });
    }
}