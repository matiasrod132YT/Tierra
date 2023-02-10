const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  ButtonStyle,
} = require("discord.js");
const { Types } = require("mongoose");

const ticketSchema = require("../../schemas/tickets/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Crear y opciones de Tickets")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("crear")
        .setDescription("Crear un ticket")
        .addChannelOption((option) => {
          return option
            .setName("canal")
            .setDescription("Canal para crear el ticket")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
        .addChannelOption((option) => {
          return option
            .setName("categoria")
            .setDescription("Categoria para crear ticket")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory);
        })
        .addRoleOption((option) => {
          return option
            .setName("rol-soporte")
            .setDescription("Support role for the ticket")
            .setRequired(true);
        })
        .addChannelOption((option) => {
          return option
            .setName("ticket-logs")
            .setDescription("The channel where ticket logs get sent in.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
        .addStringOption((option) => {
          return option
            .setName("descripcion")
            .setDescription("Texto del panel de tickets")
            .setRequired(false);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("eliminar").setDescription("Eliminar el sistema de tickets")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "crear") {
      const channel = interaction.options.getChannel("canal");
      const category = interaction.options.getChannel("categoria");
      const supportRole = interaction.options.getRole("rol-soporte");
      const description = interaction.options.getString("descripcion");
      const ticketLogs = interaction.options.getChannel("ticket-logs");

      const data = await ticketSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (data) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("¡Ya has creado un sistema de tickets!")
              .addFields({
                name: "💬 | Canal",
                value: `» <#${data.channelId}>`,
                inline: true,
              }),
          ],
          ephemeral: true,
        });
        return;
      }

      const newSchema = new ticketSchema({
        _id: Types.ObjectId(),
        guildId: interaction.guild.id,
        channelId: channel.id,
        supportId: supportRole.id,
        categoryId: category.id,
        logsId: ticketLogs.id,
      });

      newSchema.save().catch((err) => console.log(err));

      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setDescription("¡Sea credo el sistema de tickets con exito!")
              .setColor(client.config.color)
              .addFields(
                {
                  name: "💬 | Canal",
                  value: `» <#${channel.id}>`,
                  inline: true,
                },
                {
                  name: "🔧 | Rol de Soporte",
                  value: `» <@${supportRole.id}>`,
                  inline: true,
                },
                {
                  name: "📝 | Panel Descripcion",
                  value: `» ${description}`,
                  inline: true,
                },
                {
                  name: "💾 | Ticket Logs",
                  value: `» ${ticketLogs}`,
                }
              ),
          ],
          ephemeral: true,
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.reply({
            content: "Ocurrio un error...",
          });
        });

      const sampleMessage =
        'Haga clic en el botón "Crear Ticket" para crear un ticket y el equipo de soporte se pondrá en contacto con usted lo mas antes posible.';

      client.channels.cache.get(channel.id).send({
        embeds: [
          new EmbedBuilder()
            .setTitle(":tickets: Ticket")
            .setDescription(description == null ? sampleMessage : description)
            .setColor(client.config.color)
        ],
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("createTicket")
              .setLabel("Crear Ticket")
              .setEmoji("🎟")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "eliminar") {
      const ticketData = await ticketSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!ticketData) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(":tickets: Ticket")
              .setDescription("¡Ya tienes creado un sistema de tickets!")
              .addFields(
                {
                  name: "🔗 | Uso",
                  value: "/ticket crear",
                  inline: true,
                },
                {
                  name: "💬 | Canal existente",
                  value: `» <#${ticketData.channelId}>`,
                }
              )
              .setColor(client.config.color)
          ],
          ephemeral: true,
        });
      }

      ticketSchema
        .findOneAndDelete({
          guildId: interaction.guild.id,
        })
        .catch((err) => console.log(err));

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(":tickets: Ticket")
            .setDescription("¡Se a eliminado con exito el sistema de ticket!")
            .setColor(client.config.color)
        ],
        ephemeral: true,
      });
    }
  },
};