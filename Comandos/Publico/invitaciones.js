const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`invitaciones`)
    .setDescription(`Contador de invitaciones de un usuario`)
    .addUserOption(option => 
        option.setName(`usuario`)
        .setDescription(`Usuario que quieres revisar sus invitaciones`)
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const usuario = interaction.options.getUser("usuario");
          let invites = await interaction.guild.invites.fetch();
          let userInv = invites.filter(u => u.inviter && u.inviter.id === usuario.id);

          let i = 0;

          userInv.forEach(inv => i += inv.uses);


          const embed = new EmbedBuilder()
          .setTitle(`👥 | INVITACIONES`)
          .setDescription(`**${usuario}** tiene \`${i}\` invitaciones`)
          .setColor(client.config.prefix)

        interaction.reply({ embeds: [embed] });
    }
};