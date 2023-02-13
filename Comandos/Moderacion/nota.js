const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    time,
  } = require("discord.js");
  const { Types } = require("mongoose");
  
  const notaSchema = require("../../schemas/Notas/NotasSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
    .setName("nota")
    .setDescription("Sistema de notas")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("añadir")
        .setDescription("Añade una nota a un usuario")
        .addUserOption((option) => {
          return option
            .setName("usuario")
            .setDescription("Selecciona un usuario")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("nota")
            .setDescription("Escribe una nota al usuario")
            .setRequired(true)
            .setMaxLength(110)
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eliminar")
        .setDescription("Elimina una nota de algun usuario")
        .addStringOption((option) => {
          return option
            .setName("id")
            .setDescription("ID de la nota")
            .setRequired(true);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("editar")
        .setDescription("Edit a note from a user.")
        .addStringOption((option) => {
          return option
            .setName("id")
            .setDescription("The ID of the note to edit.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("note")
            .setDescription("The note to edit from a user.")
            .setRequired(true);
        })
    ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      const { options, member, userId, guild } = interaction;
  
      switch (options.getSubcommand()) {
        case "añadir":
          const nota = options.getString("nota");
          const usuario = options.getUser("usuario");
          const notaTiempo = time();
  
          const nuevoSchema = new notaSchema({
            _id: Types.ObjectId(),
            Guild: guild.id,
            User: usuario.id,
            Nota: nota,
            Staff: member.user.id,
            Tiempo: notaTiempo,
          });
  
          nuevoSchema.save().catch((err) => console.log(err));
  
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
              .setTitle("📋 | Sistema de Notas")
              .setDescription(`Se agregó con exito la nota al usuario!\n> Nota: \`${nota}\``)
              .setColor(client.config.color),
            ],
            ephemeral: true,
          });
          break;
  
        case "eliminar":
          const notaId = options.getString("id");
          const datos = await notaSchema.findById(notaId);
  
          const error = new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(`No hay nota que coincida con \`${notaId}\` en la base de datos.`)
          .setColor(client.config.color)
  
          if (!datos) await interaction.reply({ embeds: [error], ephemeral: true });
  
          datos.delete();
  
          const success = new EmbedBuilder()
          .setTitle("📋 | Sistema de Notas")
          .setDescription(`Se a eliminado con exito la nota de <@${datos.User}>!`)
          .setColor(client.config.color)
  
          await interaction.reply({
            embeds: [success],
            ephemeral: true,
          });
          break;
        case "editar":
          const nuevaNota = options.getString("note");
          const nuevaId = options.getString("id");
  
          const nuevosDatos = await notaSchema.findById(nuevaId);
  
          const err = new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(`No hay nota que coincida con \`${nuevaId}\` en la base de datos.`)
          .setColor(client.config.color)
  
          if (!nuevosDatos) await interaction.reply({ embeds: [err], ephemeral: true });
  
          await notaSchema.findOneAndUpdate(
            { guildId: guild.id, _id: nuevaId },
            { note: nuevaNota }
          );
  
          const suc = new EmbedBuilder()
          .setTitle("📋 | Sistema de Notas")
          .setDescription(`Se a editado con exito la nota de <@${nuevosDatos.User}> a \`${nuevaNota}\``)
          .setColor(client.config.color)
  
          await interaction.reply({
            embeds: [suc],
            ephemeral: true,
          });
        default:
          break;
      }
    },
  };