const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Ayuda"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client, message) {
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`pag1`)
          .setLabel(`Menu`)
          .setEmoji(`🛡`)
          .setStyle(ButtonStyle.Success),
  
        new ButtonBuilder()
          .setCustomId(`pag2`)
          .setLabel(`Utilidad`)
          .setEmoji(`🔰`)
          .setStyle(ButtonStyle.Primary),
  
        new ButtonBuilder()
          .setCustomId(`pag3`)
          .setLabel(`Moderacion`)
          .setEmoji(`🛠`)
          .setStyle(ButtonStyle.Primary),
        
        new ButtonBuilder()
          .setCustomId(`pag4`)
          .setLabel(`Diversion`)
          .setEmoji(`🔮`)
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`pag5`)
          .setLabel(`Musica`)
          .setEmoji(`🎼`)
          .setStyle(ButtonStyle.Primary)
      );
  
      const embed = new EmbedBuilder()
      .setTitle(`🛡 | Menu de Ayuda`)
      .setDescription(`Elije una seccion de ayuda`)
      .addFields(
        {
          name: `Prefix`,
          value: `\`/\``,
        }, 
      )
      .setColor(client.config.prefix)
  
      const embed2 = new EmbedBuilder()
        .setTitle(`🔰 | Comandos de utilidad`)
        .addFields(
          {
            name: `/avatar`,
            value: `Te mostrare tu avatar o el de algun usuario`,
          },
          {
            name: `/bot-servers`,
            value: `Te mostrare los server en los que estoy`,
          },
          {
            name: `/botinfo`,
            value: `Te mostrare alguna informacion sobre mi`,
          },
          {
            name: `/invitaciones`,
            value: `Te mostare las invitaciones de alguien`,
          },
          {
            name: `/invitame`,
            value: `Te mostare un link para invitarme a tu server`,
          },
          {
            name: `/ping`,
            value: `Muesta el ping del bot`,
          },
          {
            name: `/review`,
            value: `Manda un review a el server o al bot`,
          },
          {
            name: `/server`,
            value: `Muestra informacion del servidor`,
          },
          {
            name: `/sugerencia`,
            value: `Muestra las invitaciones de un usuario`,
          },
          {
            name: `/user`,
            value: `Te mostrare tu informacion o la de algun usuario`,
          }
        )
        .setColor(client.config.prefix)
  
      const embed3 = new EmbedBuilder()
        .setTitle(`🛠 | Comandos de Moderacion`)
        .addFields(
          {
            name: `/ban`,
            value: `Banear a un usario del servidor`,
          },
          {
            name: `/unban`,
            value: `Desbanear a un usuario`,
          },
          {
            name: `/kick`,
            value: `Expulsar a un usuario del servidor`,
          },
          {
            name: `/advertencia`,
            value: `Advertir a un usuario del servidor`,
          },
          {
            name: `/advertencias`,
            value: `Ver advertencias de un usuario del servidor`,
          },
          {
            name: `/eliminar-advertencias`,
            value: `Eliminar advertencias de un usuario del servidor`,
          },
          {
            name: `/clear`,
            value: `Elimina una cantidad de mensajes en un canal`,
          },
          {
            name: `/mute`,
            value: `Mutea a un usuario del servidor`,
          },
          {
            name: `/md`,
            value: `Manda un mensaje md a un usuario del servidor`,
          },
          {
            name: `/unmute`,
            value: `Desmutea a un usuario del servidor`,
          },
          {
            name: `/antilink`,
            value: `Prende o apaga el sistema AntiLink`,
          },
          {
            name: `/anuncio`,
            value: `Manda un anuncio al servidor`,
          },
          {
            name: `/encuesta`,
            value: `Manda una encuesta al servidor`,
          },
          {
            name: `/rol`,
            value: `Añade o elimina un rol de un usuario`,
          },
          {
            name: `/tickets`,
            value: `Crea un sistema de tickets`,
          },
          {
            name: `/verificacion`,
            value: `Crea un sistema de verificacion`,
          },
        )
        .setColor(client.config.prefix)

      const embed4 = new EmbedBuilder()
        .setTitle(`🔮 | Comandos de Diversion`)
        .addFields(
          {
            name: `/8ball`,
            value: `Bola magica, Respondere tus preguntas`,
          },
          {
            name: `/carcel`,
            value: `Foto de avatar en la carcel`,
          },
          {
            name: `/comentar`,
            value: `Comenta algo en YouTube`,
          },
          {
            name: `/dados`,
            value: `Tira un dado y saldra un numero`,
          },
          {
            name: `/dice`,
            value: `Di algo y lo dire`,
          },
          {
            name: `/gay`,
            value: `Bandera gay en el avatar de un usuario`
          },
          {
            name: `/meme`,
            value: `Memes randoms de reddit`,
          },
          {
            name: `/nitro`,
            value: `Manda nitro a alguien`,
          },
          {
            name: `/numero`,
            value: `Avento adivina el numero`,
          },
          {
            name: `/ppt`,
            value: `Juega Piedra, Papel o Tijera`,
          },
          {
            name: `/tirarmoneda`,
            value: `Tira una moneda y saldra cara o sello`,
          },
          {
            name: `/tweet`,
            value: `Twittea algo en Twitter`
          },
        )
        .setColor(client.config.prefix)

      const embed5 = new EmbedBuilder()
        .setTitle(`🎼 | Comandos de Musica`)
        .addFields(
          {
            name: `/musica play`,
            value: `Pon una cancion`,
          },
          {
            name: `/musica volumen`,
            value: `Ajusta el volumen`,
          },
          {
            name: `/musica cancion`,
            value: `Pon una cancion por medio de un link de YT`,
          },
          {
            name: `/musica opciones`,
            value: `Configura el sistema de musica`,
          }
        )
        .setColor(client.config.prefix)
  
      interaction.reply({ embeds: [embed], components: [button] });
  
      const collector = interaction.channel.createMessageComponentCollector();
  
      collector.on(`collect`, async (i) => {
        if (i.customId === `pag2`) {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({
              content: `Solo la persona que ejecuto el comando puede utilizar los botones!`,
              ephemeral: true,
            });
          }
          await i.update({ embeds: [embed2], components: [button] });
        }
  
        if (i.customId === `pag1`) {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({
              content: `Solo la persona que ejecuto el comando puede utilizar los botones!`,
              ephemeral: true,
            });
          }
          await i.update({ embeds: [embed], components: [button] });
        }
  
        if (i.customId === `pag3`) {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({
              content: `Solo la persona que ejecuto el comando puede utilizar los botones!`,
              ephemeral: true,
            });
          }
          await i.update({ embeds: [embed3], components: [button] });
        }

        if (i.customId === `pag4`) {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({
              content: `Solo la persona que ejecuto el comando puede utilizar los botones!`,
              ephemeral: true,
            });
          }
          await i.update({ embeds: [embed4], components: [button] });
        }

        if (i.customId === `pag5`) {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({
              content: `Solo la persona que ejecuto el comando puede utilizar los botones!`,
              ephemeral: true,
            });
          }
          await i.update({ embeds: [embed5], components: [button] });
        }
      });
    },
  };