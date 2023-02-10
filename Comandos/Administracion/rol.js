const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("rol")
      .setDescription("Manage roles of the server or members.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addSubcommand((subcommand) => subcommand
        .setName("añadir")
        .setDescription("Añade un rol a un usuario")
        .addRoleOption((option) => option
          .setName("rol")
          .setDescription("Rol que quieres dar al usuario")
          .setRequired(true))
        .addUserOption((option) => option
          .setName("usuario")
          .setDescription("Selecciona un usuario")
          .setRequired(true)
        ))
      .addSubcommand((subcommand) => subcommand
        .setName("remover")
        .setDescription("remueve un rol a un usuario")
        .addRoleOption((option  ) => option
          .setName("rol")
          .setDescription("Rol que quieras remover del usuario")
          .setRequired(true))
        .addUserOption((option) => option
          .setName("usuario")
          .setDescription("Selecciona un usuario")
          .setRequired(true)
        )),
    async execute(interaction, client) {
      if (interaction.options.getSubcommand() === 'añadir') {
        try {
          const rol = interaction.options.getRole('rol');
          const usuario = interaction.options.getMember('usuario');
          
          await usuario.roles.add(rol);

          const embed = new EmbedBuilder()
            .setTitle('Rol Añadido')
            .setDescription(`Se a añadido con exito el rol ${rol} a ${usuario}`)
            .setColor(client.config.color)
            .setTimestamp()
            .setFooter({ text: `Solicitado por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

          interaction.reply({ embeds: [embed], ephemeral: true })
        } catch {
          const embed2 = new EmbedBuilder()
            .setDescription(`Algo salio mal. Unase al servidor de soporte para informar del error`)
            .setColor(client.config.color)
          return interaction.reply({ embeds: [embed2], ephemeral: true });
        }
      }
      if (interaction.options.getSubcommand() === 'remover') {
        const rol = interaction.options.getRole('rol');
        const usuario = interaction.options.getMember('usuario');

        const errembed2 = new EmbedBuilder()
          .setDescription(`**El usuario no tiene el rol que seleccionastes**`)
          .setColor(client.config.color)

        if (!usuario.roles.cache.has(rol.id)) {
          return interaction.reply({ embeds: [errembed2], ephemeral: true })
        }
        if (usuario.roles.cache.has(rol.id)) {
          try {
            await usuario.roles.remove(rol);
  
            const embed = new EmbedBuilder()
              .setTitle('Rol Removido')
              .setDescription(`Se a removido con exito el rol ${rol} a ${usuario}`)
              .setColor(client.config.color)
              .setTimestamp()
              .setFooter({ text: `Solicitado por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
  
            interaction.reply({ embeds: [embed], ephemeral: true })
          } catch {
            const errembed = new EmbedBuilder()
            .setDescription(`Algo salio mal. Unase al servidor de soporte para informar del error`)
            .setColor(client.config.color)
            return interaction.reply({ embed: [errembed], ephemeral: true });
          }
        }
      }
    }
  }

