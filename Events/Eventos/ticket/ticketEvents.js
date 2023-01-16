const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const { Types } = require("mongoose");
  
  const ticketSchema = require("../../../schemas/tickets/ticketSchema");
  const userSchema = require("../../../schemas/tickets/userSchema");
  
  const { createTranscript } = require("discord-html-transcripts");
  
  module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      if (interaction.isButton) {
        const { channel, member, guild, customId } = interaction;
  
        switch (customId) {
          case "createTicket":
            const userId = interaction.user.id;
  
            const data = await ticketSchema.findOne({
              guildId: guild.id,
            });
  
            if (!data)
              return await interaction.reply({
                content: "¡Todavia no has creado un sistema de tickets!",
                ephemeral: true,
              });
  
            const channelPermissions = [
              "ViewChannel",
              "SendMessages",
              "AddReactions",
              "ReadMessageHistory",
              "AttachFiles",
              "EmbedLinks",
              "UseApplicationCommands",
            ];
  
            const ticketEmbed = new EmbedBuilder().setColor("#FF3939");
  
            interaction.guild.channels
              .create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: data.categoryId,
                permissionOverwrites: [
                  {
                    id: userId,
                    allow: [channelPermissions],
                  },
                  {
                    id: data.supportId,
                    allow: [channelPermissions],
                  },
                  {
                    id: interaction.guild.roles.everyone.id,
                    deny: ["ViewChannel"],
                  },
                ],
              })
              .then(async (channel) => {
                userSchema.create({
                  _id: Types.ObjectId(),
                  guildId: guild.id,
                  ticketId: channel.id,
                  claimed: false,
                  closed: false,
                  deleted: false,
                  creatorId: userId,
                  claimer: null,
                });
  
                channel.setRateLimitPerUser(2);
  
                ticketEmbed
                  .setTitle(`:tickets: Ticket`)
                  .setDescription(
                    `Bienvenido <@${userId}> a tu ticket. Espere a que el equipo de soporte responda a su ticket, mientras tanto, expliquenos su situación!`
                  );
  
                channel.send({
                  embeds: [ticketEmbed],
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("closeTicket")
                        .setLabel("Cerrar")
                        .setEmoji("🔒")
                        .setStyle(ButtonStyle.Secondary)
                    ),
                  ],
                });
  
                await channel
                  .send({
                    content: `${member}`,
                  })
                  .then((message) => {
                    setTimeout(() => {
                      message.delete().catch((err) => console.log(err));
                    }, 5 * 1000);
                  });
  
                await interaction
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription(
                          `**Tu ticket se a creado exitosamente en <#${channel.id}>!**`
                        )
                        .setColor("#FF3939"),
                    ],
                    ephemeral: true,
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch(async (err) => {
                console.log(err);
              });
            break;
  
          case "closeTicket":
            const ticketsData = await ticketSchema.findOne({
              guildId: guild.id,
            });
            const usersData = await userSchema.findOne({
              guildId: guild.id,
              ticketId: channel.id,
            });
  
            if (!member.roles.cache.find((r) => r.id === ticketsData.supportId)) {
              return await interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#FF3939")
                    .setDescription(`¡No tienes permiso para usar este boton!`),
                ],
                ephemeral: true,
              });
            }
  
            if (usersData.closed === true)
              return await interaction.reply({
                embeds: [
                  new EmbedBuilder().setDescription("El ticket ya está cerrado..").setColor("#FF3939")
                ]
              });
  
            await userSchema.updateMany(
              {
                ticketId: channel.id,
              },
              {
                closed: true,
                closer: member.id,
              }
            );
  
            if (!usersData.closer == member.id)
              return await interaction.reply({
                embeds: [
                  new EmbedBuilder().setDescription("¡No eres el usuario que cerro este ticket!").setColor("#FF3939")
                ],
                ephemeral: true,
              });
  
            client.channels.cache
              .get(usersData.ticketId)
              .permissionOverwrites.edit(usersData.creatorId, {
                ViewChannel: false,
              });
  
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FF3939")
                  .setTitle("Ticket Cerrado")
                  .setDescription(
                    "El ticket se ha cerrado, ¡el usuario que creó este ticket no puede verlo ahora!"
                  )
                  .addFields(
                    {
                      name: "Creador del ticket:",
                      value: `<@${usersData.creatorId}>`,
                    },
                    {
                      name: "Ticket cerrado por:",
                      value: `<@${member.user.id}>`,
                    },
                    {
                      name: "Cerrado el:",
                      value: `${new Date().toLocaleString()}`,
                    }
                  )
                  .setFooter({
                    text: `${client.user.tag} - Sistema de tickets`,
                    iconURL: client.user.displayAvatarURL(),
                  }),
              ],
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder()
                    .setCustomId("reopenTicket")
                    .setEmoji("🔓")
                    .setLabel("Reabrir")
                    .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                    .setCustomId("deleteTicket")
                    .setEmoji("🗑")
                    .setLabel("Eliminar")
                    .setStyle(ButtonStyle.Danger)
                ),
              ],
            });
            break;
  
          case "reopenTicket":
            const uData = await userSchema.findOne({
              guildId: guild.id,
              ticketId: channel.id,
            });
  
            if (!uData.closed)
              return await interaction.reply({
                embeds: [
                  new EmbedBuilder().setDescription("El ticket no está cerrado.").setColor("#FF3939")
                ]
              });
  
            await userSchema.updateMany(
              {
                ticketId: channel.id,
              },
              {
                closed: false,
              }
            );
  
            interaction.message.edit({
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder()
                  .setCustomId("ticket-reopen")
                  .setLabel("Reabrir")
                  .setEmoji("🔓")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
                  new ButtonBuilder()
                    .setCustomId("ticket-delete")
                    .setLabel("Eliminar")
                    .setEmoji("🗑")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
                ),
              ],
            });
  
            client.channels.cache
              .get(uData.ticketId)
              .permissionOverwrites.edit(uData.creatorId, {
                ViewChannel: true,
              });
  
            await interaction
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Ticket Reabierto!")
                    .setDescription(`Reabierto por ${member.user.tag}`)
                    .setColor("#FF3939"),
                ],
                ephemeral: true
              })
              .catch((err) => console.log(err));
            break;
          case "deleteTicket":
            const tksData = await ticketSchema.findOne({
              guildId: guild.id,
            });
            const usrData = await userSchema.findOne({
              guildId: interaction.guild.id,
              ticketId: channel.id,
            });
  
            if (!member.roles.cache.find((r) => r.id === tksData.supportId)) {
              return await interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#FF3939")
                    .setDescription(`No tienes permiso para usar este botón`),
                ],
                ephemeral: true,
              });
            }
  
            interaction.message.edit({
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder()
                    .setCustomId("ticket-close")
                    .setLabel("Cerrar")
                    .setEmoji("🔒")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
                ),
              ],
            });
  
            userSchema
              .findOneAndDelete({
                guildId: guild.id,
              })
              .catch((err) => console.log(err));
  
            setTimeout(
              () => channel.delete().catch((err) => console.log(err)),
              5 * 1000
            );
  
            const transcript = await createTranscript(channel, {
              limit: -1,
              returnBuffer: false,
              fileName: `Ticket-${member.user.username}.html`,
            });
  
            await client.channels.cache
              .get(tksData.logsId)
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Ticket Cerrado")
                    .setDescription(`Transcript: (download)[${transcript}]`)
                    .addFields(
                      {
                        name: "Cerrado por:",
                        value: `<@${usrData.closer}>`
                      },
                      {
                        name: "Ticket eliminado por:",
                        value: `<@${member.user.id}>`
                      },
                      {
                        name: "Eliminado el:",
                        value: `${new Date().toLocaleString()}`
                      }
                    )
                    .setColor("#FF3939"),
                ],
                files: [transcript],
              })
              .catch((err) => console.log(err));
  
            await interaction
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Ticket Cerrado")
                    .setDescription(`Eliminado por ${member.user.tag}`)
                    .addFields({
                      name: "Tiempo",
                      value: "El ticket se eliminara en 5 segundos...",
                    })
                    .setColor("#FF3939"),
                ],
              })
              .catch((err) => console.log(err));
  
            break;
          default:
            break;
        }
      }
    },
  };