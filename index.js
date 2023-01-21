const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  Events,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const mongoose = require("mongoose");

require("discord-player/smoothVolume");
const { Player } = require("discord-player");

const { Guilds, GuildMembers, GuildMessageReactions, GuildMessages, MessageContent, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessageReactions, GuildMessages, MessageContent, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember],
});

mongoose.connect("mongodb+srv://Matiasrod132:Wesersa12345@tierra.dhgdheq.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado correctamente a MongoDB.")
}).catch(() => {
  console.log("Ocurrio un error al conectarse a MongoDB.")
})

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

const player = new Player(client);
player.on("trackStart", (queue, track) =>
  queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
);

// Add the player on the client
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.login(client.config.token);

const config = require(`${process.cwd()}/config.json`);
require(`colors`);

process.on("unhandledRejection", (razon, p) => {
  const CanalId = "1055744060230467634";
  console.error("Unhandled promise rejection:", razon, p);
  const Embed = new EmbedBuilder()
    .setTitle("Error Encontrado")
    .setFooter({ text: "⚠️Sistema AntiCrash" })
    .setTimestamp()
    .setColor("#FF3939");
  const Canal = client.channels.cache.get(CanalId);
  if (!Canal) return;
  Canal.send({
    embeds: [
      Embed.setDescription(
        "```" + razon + "```"
      ),
    ],
  });
});a