require("discord-player/smoothVolume");
const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { QueryType } = require("discord-player");
module.exports = {
  subCommand: "musica.cancion",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
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
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });
    // finish if no tracks were found
    if (result.tracks.length === 0)
      return interaction.reply({ content: "Sin Resultados", ephemeral: true });
    // Add the track to the queue
    const song = result.tracks[0];
    await queue.addTrack(song);
    const embed = new EmbedBuilder()
      .setDescription(
        `**[${song.title}](${song.url})** fue añadido a la cola de canciones`
      )
      .setThumbnail(song.thumbnail)
      .setColor(client.config.prefix)
      .setFooter({ text: `Duracion: ${song.duration}` });
    // Respond with the embed containing information about the player
    await interaction.reply({
      embeds: [embed],
    });
    // Play the song
    if (!queue.playing) await queue.play();
  },
};