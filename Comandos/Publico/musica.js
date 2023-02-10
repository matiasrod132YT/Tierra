require("discord-player/smoothVolume");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("musica")
    .setDescription("Sistema de Musica")
    .addSubcommand((subcommand) => subcommand
      .setName("play")
      .setDescription("Pon una cancion")
      .addStringOption((option) => option
        .setName("buscar")
        .setDescription("Buscar cancion")
        .setRequired(true)
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("cancion")
      .setDescription("Pon una cancion por URL")
      .addStringOption((option) => option
        .setName("url")
        .setDescription("URL de Youtube")
        .setRequired(true)
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("opciones")
      .setDescription("Configura el sistema de Musica")
      .addStringOption(option =>
        option
          .setName("accion")
          .setDescription("Accion")
          .addChoices(
            { name: "pausa", value: "pausa" },
            { name: "renaudar", value: "renaudar" },
            { name: "skip", value: "skip" },
            { name: "queue", value: "queue" },
            { name: "exit", value: "exit" }
          )
          .setRequired(true)
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("volumen")
      .setDescription("Set volume")
      .addNumberOption((option) => option
        .setName("volumen")
        .setDescription("volume (1 to 100)")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
      )
    ),
    async execute(interaction, client) {
      const { options } = interaction;
      if (interaction.options.getSubcommand() === 'play') {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel)
          return interaction.reply({
            content: "**:x: | Necesitas estar en un Canal de Voz**",
            ephemeral: true,
          });

        // Create a play queue for the server
        const queue = await client.player.createQueue(interaction.guild);

        // Wait until you are connected to the channel
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);

        // Search for the song using the discord-player
        let url = interaction.options.getString("buscar");
        const result = await client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        });

        // finish if no tracks were found
        if (result.tracks.length === 0)
          return interaction.reply({ content: "**Sin Resultados**", ephemeral: true });

        // Add the track to the queue
        const song = result.tracks[0];
        await queue.addTrack(song);
        await queue.setVolume(50);
        const embed = new EmbedBuilder()
          .setDescription(
            `**[${song.title}](${song.url})** fue añadido a la cola de canciones`
          )
          .setThumbnail(song.thumbnail)
          .setColor(client.config.color)
          .setFooter({ text: `Duracion: ${song.duration}` });
        // Respond with the embed containing information about the player
        await interaction.reply({
          embeds: [embed],
        });
        // Play the song
        if (!queue.playing) await queue.play();
      }
      if (interaction.options.getSubcommand() === 'volumen') {
        var queue = client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            content: "**:x: | Necesitas estar en un Canal de Voz**",
            ephemeral: true,
          });
        // Check if the queue is empty
        if (!queue) {
          await interaction.reply({
            content: "No hay una canción sonando",
            ephemeral: true,
          });
          return;
        }
    
        // Search for the song using the discord-player
        let volumen = interaction.options.getNumber("volumen");
        if (volumen > 100) {
          return interaction.reply({
            content: "**:x: | El Volumen es de 1-100",
            ephemeral: true,
          });
        }
        queue.setVolume(volumen);
        interaction.reply({ content: `**El Volumen se a estableciado a ${volumen}%**`, ephemeral: true });
      }
      if (interaction.options.getSubcommand() === 'cancion') {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel)
          return interaction.reply({
            content: "**:x: | Necesitas estar en un Canal de Voz**",
            ephemeral: true,
          });

        // Create a play queue for the server
        const queue = await client.player.createQueue(interaction.guild);

        // Wait until you are connected to the channel
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);

        let url = interaction.options.getString("url");

        // Search for the song using the discord-player
        const result = await client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_SONG,
        });
        // finish if no tracks were found
        if (result.tracks.length === 0)
          return interaction.reply({ content: "Sin Resultados", ephemeral: true });
        // Add the track to the queue
        const song = result.tracks[0];
        await queue.addTrack(song);
        const embed2 = new EmbedBuilder()
          .setDescription(
            `**[${song.title}](${song.url})** fue añadido a la cola de canciones`
          )
          .setThumbnail(song.thumbnail)
          .setColor(client.config.color)
          .setFooter({ text: `Duracion: ${song.duration}` });
        // Respond with the embed containing information about the player
        await interaction.reply({
          embeds: [embed2],
        });
        // Play the song
        if (!queue.playing) await queue.play();
      }
      var queue = client.player.getQueue(interaction.guild);
      switch(options.getString("accion")) {
        case "pausa": {
          if (!interaction.member.voice.channel)
            return interaction.reply({
              content: "**:x: | Necesitas estar en un Canal de Voz**",
              ephemeral: true,
            });
          // Check if the queue is empty
          if (!queue) {
            await interaction.reply({
              content: "**No hay una cancion reproduciéndose**",
              ephemeral: true,
            });
            return;
          }
    
          // Pause the current song
          queue.setPaused(true);
    
          await interaction.reply({ content: "**La cancion fue pausada!**", ephemeral: true });
        }
        break;
        case "renaudar": {
          if (!interaction.member.voice.channel)
            return interaction.reply({
              content: "**:x: | Necesitas estar en un Canal de Voz**",
              ephemeral: true,
            });
          // Check if the queue is empty
          if (!queue) {
            await interaction.reply({
              content: "**No hay canciones en la cola**",
              ephemeral: true,
            });
            return;
          }
    
          // Pause the current song
          queue.setPaused(false);
    
          await interaction.reply({
            content: "**La cancion fue reanudada**",
            ephemeral: true,
          });
        }
        break;
        case "skip": {
          if (!interaction.member.voice.channel)
            return interaction.reply({
              content: "**:x: | Necesitas estar en un Canal de Voz**",
              ephemeral: true,
            });
          // If there is no queue, return
          if (!queue) {
            await interaction.reply({
              content: "**No hay canciones en la cola**",
              ephemeral: true,
            });
            return;
          }
    
          const currentSong = queue.current;
    
          // Skip the current song
          queue.skip(currentSong);
          queue.play.nextSong;
    
          // Return an embed to the user saying the song has been skipped
    
          const embed = new EmbedBuilder()
            .setDescription(`${currentSong.title} fue skipeada!`)
            .setThumbnail(currentSong.thumbnail)
            .setColor(client.config.color);
          interaction.reply({ embeds: [embed] });
        }
        break;
        case "queue": {
          if (!interaction.member.voice.channel)
            return interaction.reply({
              content: "**:x: | Necesitas estar en un Canal de Voz**",
              ephemeral: true,
            });
          // check if there are songs in the queue
          if (!queue || !queue.playing) {
            await interaction.reply({
              content: "**No hay canciones en la cola**",
              ephemeral: true,
            });
            return;
          }
    
          // Get the first 10 songs in the queue
          const queueString = queue.tracks
            .slice(0, 10)
            .map((song) => {
              return `\`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
            })
            .join("\n");
    
          // Get the current song
          const currentSong = queue.current;
    
          const embed = new EmbedBuilder()
            .setDescription(
              `**Reproduciendo**\n` +
                (currentSong
                  ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>`
                  : "None") +
                `\n\n**Queue**\n${queueString}`
            )
            .setThumbnail(currentSong.setThumbnail)
            .setColor(client.config.color);
    
          interaction.reply({ embeds: [embed] });
        }
        break;
        case "salir": {
          if (!interaction.member.voice.channel)
            return interaction.reply({
              content: "**:x: | Necesitas estar en un Canal de Voz**",
              ephemeral: true,
            });
          if (!queue) {
            await interaction.reply({
              content: "**No hay una canción sonando**",
              ephemeral: true,
            });
            return;
          }
    
          // Deletes all the songs from the queue and exits the channel
          queue.destroy();
    
          await interaction.reply({
            content: "**Dejó de reproducir la canción**",
            ephemeral: true,
          });
        }
        break;
      }
    }
}