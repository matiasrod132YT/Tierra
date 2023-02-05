const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`ship`)
    .setDescription(`Shipea a un usuario`)
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(`awdadw`)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("usuario2")
        .setDescription(`awdadw`)
        .setRequired(true)
    ),
    async execute(interaction, client, args) {
        const usuario1 = interaction.options.getMember('usuario');
        const usuario2 = interaction.options.getMember('usuario2');

        var resultado = Math.ceil(Math.random() * 100);

        const embed = new EmbedBuilder()
        .setTitle(`♥・Medidor de amor`)
        .setDescription(`Mira cuánto coinciden!`)
        .addFields(
            { name: `Persona 1`, value: `${usuario1}`, inline: true },
            { name: `+`, value: ` `, inline: true },
            { name: `Persona 2`, value: `${usuario2}`, inline: true },
            { name: `Resultado`, value: `**${usuario1}** y **${usuario2}** son **${resultado}%**`, inline: false },
        )
        .setColor(client.config.prefix)

        const embed2 = new EmbedBuilder()
        .setTitle(`♥・Medidor de amor`)
        .setDescription(`No puedes shipear a la misma persona`)
        .setColor(client.config.prefix)
    
        if (!usuario1) return interaction.reply({ content: "Seleccion" });
    
        if (usuario1 == usuario2) return interaction.reply({ embeds: [embed2] });

        await interaction.reply({ embeds: [embed] });
    }
}