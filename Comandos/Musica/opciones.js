require("discord-player/smoothVolume");
const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "musica.opciones",

  /**
   *
   * @param {ChatInputCommandInteraction} interactiona
   * @param {Client} client
   * @returns
   */

  async execute(interaction, client) {
    var { guild, options } = interaction;
    var action = options.getString("accion");
    // Get the current queuea
    var queue = client.player.getQueue(guild);
    if (action == "pausa") {
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
      if (action == "renaudar") {
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
    if (action == "skip") {
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

      // Return an embed to the user saying the song has been skipped

      const embed = new EmbedBuilder()
        .setDescription(`${currentSong.title} fue skipeada!`)
        .setThumbnail(currentSong.thumbnail)
        .setColor(client.config.prefix);
      interaction.reply({ embeds: [embed] });
    }
    if (action == "queue") {
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
        .setColor(client.config.prefix);

      interaction.reply({ embeds: [embed] });
    }
    if (action == "salir") {
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
  },
};